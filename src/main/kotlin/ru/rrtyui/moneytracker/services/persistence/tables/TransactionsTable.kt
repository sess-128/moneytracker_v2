package ru.rrtyui.moneytracker.services.persistence.tables

import java.math.BigDecimal
import java.time.LocalDateTime
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.javatime.CurrentDateTime
import org.jetbrains.exposed.v1.javatime.datetime


object TransactionsTable: UUIDTable("storage.transactions") {
    val userId = reference("user_id", UsersTable)
    val categoryId = reference("category_id",CategoriesTable)
    val amount: Column<BigDecimal> = decimal("amount", 18, 4)
    val transactionDate: Column<LocalDateTime> = datetime("transaction_date").defaultExpression(CurrentDateTime)
    val description: Column<String?> = varchar("description", 255).nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").defaultExpression(CurrentDateTime)
}