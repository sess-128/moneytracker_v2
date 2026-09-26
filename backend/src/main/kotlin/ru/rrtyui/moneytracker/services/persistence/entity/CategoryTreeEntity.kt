package ru.rrtyui.moneytracker.services.persistence.entity

import java.util.UUID
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.dao.java.UUIDEntity
import org.jetbrains.exposed.v1.dao.java.UUIDEntityClass
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryTreeTable

class CategoryTreeEntity(id: EntityID<UUID>) : UUIDEntity(id) {
    companion object : UUIDEntityClass<CategoryTreeEntity>(CategoryTreeTable)

    var userId by CategoryTreeTable.userId
    var categoryId by CategoryTreeTable.categoryId
    var parentId by CategoryTreeTable.parentId
}