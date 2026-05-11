package ru.rrtyui.moneytracker.repository

import java.time.LocalDateTime
import java.util.UUID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.insertAndGetId
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.api.dto.transaction.CreateTransactionRequestDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionResponseDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionUpdateRequestDto
import ru.rrtyui.moneytracker.entity.Transactions
import ru.rrtyui.moneytracker.mapper.toTransactionDto
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@Repository
class TransactionRepository {

    fun findByUser(
        principal: UserPrincipal
    ): List<TransactionResponseDto> = transaction {

        Transactions
            .selectAll()
            .where { Transactions.userId eq principal.id }
            .map { it.toTransactionDto() }
    }

    fun findById(
        transactionId: UUID
    ): TransactionResponseDto? = transaction {

        Transactions
            .selectAll()
            .where { Transactions.id eq transactionId }
            .map { it.toTransactionDto() }
            .singleOrNull()
    }

    fun createTransaction(transactionDto: CreateTransactionRequestDto, userId: UUID): TransactionResponseDto =
        transaction {
            val transactionId = Transactions.insertAndGetId {
                it[Transactions.userId] = userId
                it[Transactions.categoryId] = transactionDto.categoryId
                it[Transactions.amount] = transactionDto.amount
                it[Transactions.transactionDate] = transactionDto.transactionDate ?: LocalDateTime.now()
                it[Transactions.description] = transactionDto.description
            }.value

            TransactionResponseDto(
                id = transactionId,
                categoryId = transactionDto.categoryId,
                amount = transactionDto.amount,
                description = transactionDto.description,
                transactionDate = transactionDto.transactionDate
            )
        }

    fun updateTransaction(transactionDto: TransactionUpdateRequestDto): Int = transaction {
        Transactions
            .update({ Transactions.id eq transactionDto.id }) {
                it[Transactions.transactionDate] = transactionDto.transactionDate
                it[Transactions.updatedAt] = LocalDateTime.now()
            }
    }
}