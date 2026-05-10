package ru.rrtyui.moneytracker.entity

import org.jetbrains.exposed.v1.core.Table

object CategoryTree : Table("relations.category_tree") {
    val userId = reference("user_id", Users)

    val categoryId = reference("category_id",Categories)

    val parentId = optReference("parent_id", Categories)

    override val primaryKey = PrimaryKey(userId, categoryId)
}