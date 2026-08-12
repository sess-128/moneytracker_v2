package ru.rrtyui.moneytracker.services.persistence.repository.impl

import java.time.LocalDateTime
import java.util.UUID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.application.security.data.UserPrincipal
import ru.rrtyui.moneytracker.client.request.TransactionUpdateRequest
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.services.persistence.entity.TransactionEntity
import ru.rrtyui.moneytracker.services.persistence.mapper.toTransactionDto
import ru.rrtyui.moneytracker.services.persistence.model.TransactionCreateRow
import ru.rrtyui.moneytracker.services.persistence.repository.TransactionRepository
import ru.rrtyui.moneytracker.services.persistence.tables.TransactionsTable

@Repository
class TransactionRepositoryImpl: TransactionRepository {

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

    override fun createTransaction(createRow: TransactionCreateRow): TransactionEntity =
        transaction {
            TransactionEntity.new {
                userId = createRow.actorId
                categoryId = createRow.categoryId
                amount = createRow.amount
                transactionDate = createRow.transactionDateTime
                description = createRow.description
            }
        }

    fun updateTransaction(transactionDto: TransactionUpdateRequest): Int = transaction {
        TransactionsTable
            .update({ TransactionsTable.id eq transactionDto.id }) {
                it[TransactionsTable.transactionDate] = transactionDto.transactionDate
                it[TransactionsTable.updatedAt] = LocalDateTime.now()
            }
    }
}