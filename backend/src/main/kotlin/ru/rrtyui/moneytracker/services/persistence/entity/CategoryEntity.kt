package ru.rrtyui.moneytracker.services.persistence.entity

import java.time.LocalDateTime
import java.util.UUID
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.dao.java.UUIDEntity
import org.jetbrains.exposed.v1.dao.java.UUIDEntityClass
import ru.rrtyui.moneytracker.services.persistence.tables.CategoriesTable

class CategoryEntity(
    id: EntityID<UUID>
): UUIDEntity(id) { companion object : UUIDEntityClass<CategoryEntity>(CategoriesTable)
    var name by CategoriesTable.name
    var type by CategoriesTable.type
    var createdAt: LocalDateTime by CategoriesTable.createdAt
    var updatedAt: LocalDateTime by CategoriesTable.updatedAt
}