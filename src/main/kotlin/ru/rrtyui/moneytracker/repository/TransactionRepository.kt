package ru.rrtyui.moneytracker.repository

import kotlinx.datetime.toKotlinLocalDateTime
import org.jetbrains.exposed.v1.core.Join
import org.jetbrains.exposed.v1.core.JoinType
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.innerJoin
import org.jetbrains.exposed.v1.jdbc.insertAndGetId
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionRequestDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionResponseDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionUpdateRequestDto
import ru.rrtyui.moneytracker.entity.Categories
import ru.rrtyui.moneytracker.entity.Transactions
import ru.rrtyui.moneytracker.entity.Users
import ru.rrtyui.moneytracker.exception.TransactionNotFoundException
import ru.rrtyui.moneytracker.mapper.toTransactional
import ru.rrtyui.moneytracker.service.data.UserData
import java.util.UUID

@Repository
class TransactionRepository {

    fun findTransactionsByUser(principal: UserData): List<TransactionResponseDto> = transaction {
        getJoinForSelectTransaction()
            .select(
                Transactions.id, Categories.name, Users.username, Transactions.amount,
                Transactions.description, Transactions.createdAt, Transactions.updatedAt
            )
            .where { Transactions.userId eq principal.id }
            .map { it.toTransactional() }
    }

    fun findTransactionsByTransactionId(transactionId: UUID): TransactionResponseDto? = transaction {
        getJoinForSelectTransaction()
            .select(
                Transactions.id, Categories.name, Users.username, Transactions.amount,
                Transactions.description, Transactions.createdAt, Transactions.updatedAt
            )
            .where { Transactions.id eq transactionId }
            .map { it.toTransactional() }
            .singleOrNull()
    }

    fun insertNewTransaction(transactionDto: TransactionRequestDto, userId: UUID, categoryId: UUID): TransactionResponseDto = transaction {
        val createdTransaction = Transactions.insertAndGetId {
            it[Transactions.userId] = userId
            it[Transactions.categoryId] = categoryId
            it[amount] = transactionDto.amount
            it[description] = transactionDto.description
        } .value
        getJoinForSelectTransaction()
            .select(
                Transactions.id,
                Categories.name,
                Users.username,
                Transactions.amount,
                Transactions.description,
                Transactions.createdAt,
                Transactions.updatedAt
            )
            .where { Transactions.id eq createdTransaction }
            .map { it.toTransactional() }
            .single()
    }

    fun updateTransaction(transactionDto: TransactionUpdateRequestDto): TransactionResponseDto = transaction {
        Transactions
            .update({ Transactions.id eq transactionDto.id }) {
                it[Transactions.createdAt] = transactionDto.createdAt.toKotlinLocalDateTime()
            }
        findTransactionsByTransactionId(transactionDto.id)
            ?: throw TransactionNotFoundException("Transaction not found by id: ${transactionDto.id}")
    }

    private fun getJoinForSelectTransaction(): Join {
        return Transactions
            .innerJoin(Categories, { Transactions.categoryId }, { Categories.id })
            .innerJoin(Users, { Transactions.userId }, { Users.id })
    }
}