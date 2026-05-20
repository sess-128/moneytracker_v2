package ru.rrtyui.moneytracker.services.persistence.repository

import java.time.LocalDateTime
import java.util.UUID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.insertAndGetId
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.client.request.TransactionCreateRequest
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.client.request.TransactionUpdateRequest
import ru.rrtyui.moneytracker.services.persistence.tables.TransactionsTable
import ru.rrtyui.moneytracker.services.persistence.mapper.toTransactionDto
import ru.rrtyui.moneytracker.services.security.data.UserPrincipal

@Repository
class TransactionRepository {

    fun findByUser(
        principal: UserPrincipal
    ): List<TransactionResponse> = transaction {

        TransactionsTable
            .selectAll()
            .where { TransactionsTable.userId eq principal.id }
            .map { it.toTransactionDto() }
    }

    fun findById(
        transactionId: UUID
    ): TransactionResponse? = transaction {

        TransactionsTable
            .selectAll()
            .where { TransactionsTable.id eq transactionId }
            .map { it.toTransactionDto() }
            .singleOrNull()
    }

    fun createTransaction(transactionDto: TransactionCreateRequest, userId: UUID): TransactionResponse =
        transaction {
            val transactionId = TransactionsTable.insertAndGetId {
                it[TransactionsTable.userId] = userId
                it[TransactionsTable.categoryId] = transactionDto.categoryId
                it[TransactionsTable.amount] = transactionDto.amount
                it[TransactionsTable.transactionDate] = transactionDto.transactionDate ?: LocalDateTime.now()
                it[TransactionsTable.description] = transactionDto.description
            }.value

            TransactionResponse(
                id = transactionId,
                categoryId = transactionDto.categoryId,
                amount = transactionDto.amount,
                description = transactionDto.description,
                transactionDate = transactionDto.transactionDate
            )
        }

    fun updateTransaction(transactionDto: TransactionUpdateRequest): Int = transaction {
        TransactionsTable
            .update({ TransactionsTable.id eq transactionDto.id }) {
                it[TransactionsTable.transactionDate] = transactionDto.transactionDate
                it[TransactionsTable.updatedAt] = LocalDateTime.now()
            }
    }
}