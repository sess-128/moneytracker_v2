package ru.rrtyui.moneytracker.services.persistence.tables

import java.time.LocalDateTime
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.javatime.datetime

object CategoriesTable: UUIDTable("storage.categories", columnName = "id") {
    val name: Column<String> = varchar("name", 128)
    val type: Column<CategoryTableType> = enumerationByName("type", 50, CategoryTableType::class)
    val createdAt: Column<LocalDateTime> = datetime("created_at").clientDefault { LocalDateTime.now() }
    val updatedAt: Column<LocalDateTime> = datetime("created_at").clientDefault { LocalDateTime.now() }

    init {
        uniqueIndex(name, type)
    }
}