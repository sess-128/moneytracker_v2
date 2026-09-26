package ru.rrtyui.moneytracker.services.persistence.tables

import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.core.java.javaUUID

object CategoryTreeTable : UUIDTable("relations.category_tree", columnName = "id") {
    val userId = javaUUID("user_id")
    val categoryId = javaUUID("category_id")
    val parentId = javaUUID("parent_id").nullable()

    init {
        uniqueIndex(userId, categoryId)
    }
}