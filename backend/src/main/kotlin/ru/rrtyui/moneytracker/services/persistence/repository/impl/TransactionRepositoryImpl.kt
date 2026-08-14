package ru.rrtyui.moneytracker.services.persistence.repository.impl

import java.util.UUID
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.services.persistence.entity.TransactionEntity
import ru.rrtyui.moneytracker.services.persistence.model.TransactionCreateRow
import ru.rrtyui.moneytracker.services.persistence.model.TransactionReplaceCategoryRow
import ru.rrtyui.moneytracker.services.persistence.repository.TransactionRepository
import ru.rrtyui.moneytracker.services.persistence.tables.TransactionsTable

@Repository
class TransactionRepositoryImpl: TransactionRepository {
    override fun create(createRow: TransactionCreateRow): TransactionEntity =
        transaction {
            TransactionEntity.new {
                userId = createRow.actorId
                categoryId = createRow.categoryId
                categoryName = createRow.categoryName
                amount = createRow.amount
                transactionDate = createRow.transactionDateTime
                description = createRow.description
            }
        }

    override fun findAll(userId: UUID): List<TransactionEntity> =
        transaction {
            val predicate = (TransactionsTable.userId eq userId)

            TransactionEntity
                .find { predicate }
                .toList()
        }

    override fun replaceCategory(replaceRow: TransactionReplaceCategoryRow) {
        transaction {
            val predicate =
                (TransactionsTable.userId eq replaceRow.actorId) and
                        (TransactionsTable.categoryId eq replaceRow.oldCategoryId)

            TransactionsTable.update (
                where = { predicate },
                body = { row ->
                    row[TransactionsTable.categoryId] = replaceRow.newCategoryId
                    row[TransactionsTable.categoryName] = replaceRow.newCategoryName
                }
            )
        }
    }
}