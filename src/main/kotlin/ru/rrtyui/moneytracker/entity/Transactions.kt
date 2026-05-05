package ru.rrtyui.moneytracker.entity

import kotlinx.datetime.LocalDateTime
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.core.java.javaUUID
import org.jetbrains.exposed.v1.datetime.CurrentDateTime
import org.jetbrains.exposed.v1.datetime.datetime
import java.math.BigDecimal
import java.util.UUID

object Transactions: UUIDTable("storage.transactions") {
    val userId: Column<UUID> = javaUUID("user_id")
    val categoryId: Column<UUID>  = javaUUID("category_id")
    val amount: Column<BigDecimal> = decimal("amount", 18, 4)
    val description: Column<String> = varchar("description", 255)
    val createdAt: Column<LocalDateTime> = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").defaultExpression(CurrentDateTime)
}