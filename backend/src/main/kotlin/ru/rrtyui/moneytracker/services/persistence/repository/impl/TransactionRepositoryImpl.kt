package ru.rrtyui.moneytracker.services.persistence.repository.impl

import java.util.UUID
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.greaterEq
import org.jetbrains.exposed.v1.core.inList
import org.jetbrains.exposed.v1.core.lessEq
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.services.persistence.entity.TransactionEntity
import ru.rrtyui.moneytracker.services.persistence.model.FilterTransactionRow
import ru.rrtyui.moneytracker.services.persistence.model.TransactionCreateRow
import ru.rrtyui.moneytracker.services.persistence.model.TransactionReplaceCategoryRow
import ru.rrtyui.moneytracker.services.persistence.repository.TransactionRepository
import ru.rrtyui.moneytracker.services.persistence.tables.TransactionsTable

@Repository
class TransactionRepositoryImpl : TransactionRepository {
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

            TransactionsTable.update(
                where = { predicate },
                body = { row ->
                    row[TransactionsTable.categoryId] = replaceRow.newCategoryId
                    row[TransactionsTable.categoryName] = replaceRow.newCategoryName
                }
            )
        }
    }

    override fun findFiltered(
        filterRow: FilterTransactionRow
    ): List<TransactionEntity> =
        transaction {
            var predicate =
                (TransactionsTable.userId eq filterRow.actorId) and
                (TransactionsTable.transactionDate greaterEq filterRow.startDate) and //TODO надо как-то брать даты нормально
                (TransactionsTable.amount greaterEq filterRow.minAmount)

            if (filterRow.categoryIds.isNotEmpty()) { //TODO выглядит как шляпа
                predicate = predicate and (TransactionsTable.categoryId inList filterRow.categoryIds)
            }

            filterRow.endDate?.let {
                predicate = predicate and (TransactionsTable.transactionDate lessEq it)
            }
            filterRow.maxAmount?.let {
                predicate = predicate and (TransactionsTable.amount greaterEq it)
            }

            TransactionEntity
                .find { predicate }
                .toList()
        }
}