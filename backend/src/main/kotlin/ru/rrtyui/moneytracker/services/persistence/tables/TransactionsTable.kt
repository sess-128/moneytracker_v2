package ru.rrtyui.moneytracker.services.persistence.tables

import java.math.BigDecimal
import java.time.LocalDateTime
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.core.java.javaUUID
import org.jetbrains.exposed.v1.javatime.CurrentDateTime
import org.jetbrains.exposed.v1.javatime.datetime


object TransactionsTable: UUIDTable("storage.transactions") {
    val userId = javaUUID("user_id")
    val categoryId = javaUUID("category_id")
    val categoryName: Column<String> = varchar("category_name", 255)
    val amount: Column<BigDecimal> = decimal("amount", 18, 4)
    val transactionDate: Column<LocalDateTime> = datetime("transaction_date").defaultExpression(CurrentDateTime)
    val description: Column<String?> = varchar("description", 255).nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").defaultExpression(CurrentDateTime)
}