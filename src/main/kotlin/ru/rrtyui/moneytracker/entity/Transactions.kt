package ru.rrtyui.moneytracker.entity

import java.math.BigDecimal
import java.time.LocalDateTime
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.javatime.CurrentDateTime
import org.jetbrains.exposed.v1.javatime.datetime


object Transactions: UUIDTable("storage.transactions") {
    val userId = reference("user_id", Users)
    val categoryId = reference("category_id",Categories)
    val amount: Column<BigDecimal> = decimal("amount", 18, 4)
    val transactionDate: Column<LocalDateTime> = datetime("transaction_date").defaultExpression(CurrentDateTime)
    val description: Column<String?> = varchar("description", 255).nullable()
    val createdAt: Column<LocalDateTime> = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").defaultExpression(CurrentDateTime)
}