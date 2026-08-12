package ru.rrtyui.moneytracker.services.persistence.entity

import java.util.UUID
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.dao.java.UUIDEntity
import org.jetbrains.exposed.v1.dao.java.UUIDEntityClass
import ru.rrtyui.moneytracker.services.persistence.tables.TransactionsTable

class TransactionEntity(
    id: EntityID<UUID>
): UUIDEntity(id) { companion object : UUIDEntityClass<TransactionEntity>(TransactionsTable)
    var userId by TransactionsTable.userId
    var categoryId by TransactionsTable.categoryId
    var amount by TransactionsTable.amount
    var transactionDate by TransactionsTable.transactionDate
    var description by TransactionsTable.description
    var createdAt by TransactionsTable.createdAt
    var updatedAt by TransactionsTable.updatedAt
}