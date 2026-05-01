package ru.rrtyui.moneytracker.entity

import kotlinx.datetime.LocalDateTime
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.datetime.CurrentDateTime
import org.jetbrains.exposed.v1.datetime.datetime

object Categories: UUIDTable("storage.categories") {
    val name: Column<String> = varchar("name", 128)
    val type: Column<CategoryType> = enumeration("type", CategoryType::class)
    val createdAt: Column<LocalDateTime> = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").defaultExpression(CurrentDateTime)
}

enum class CategoryType {
    EXPENSE,
    INCOME,
    SAVINGS
}