package ru.rrtyui.moneytracker.services.persistence.tables

import kotlinx.datetime.LocalDateTime
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.datetime.CurrentDateTime
import org.jetbrains.exposed.v1.datetime.datetime

object CategoriesTable: UUIDTable("storage.categories") {
    val name: Column<String> = varchar("name", 128)
    val type: Column<CategoryType> = enumerationByName("type", 50,CategoryType::class)
    val createdAt: Column<LocalDateTime> = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt: Column<LocalDateTime> = datetime("updated_at").defaultExpression(CurrentDateTime)
}