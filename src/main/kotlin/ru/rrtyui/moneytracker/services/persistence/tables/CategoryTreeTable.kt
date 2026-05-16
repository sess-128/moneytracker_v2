package ru.rrtyui.moneytracker.services.persistence.tables

import org.jetbrains.exposed.v1.core.Table

object CategoryTreeTable : Table("relations.category_tree") {
    val userId = reference("user_id", UsersTable)

    val categoryId = reference("category_id",CategoriesTable)

    val parentId = optReference("parent_id", CategoriesTable)

    override val primaryKey = PrimaryKey(userId, categoryId)
}