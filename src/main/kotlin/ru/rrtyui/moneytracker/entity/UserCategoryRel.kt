package ru.rrtyui.moneytracker.entity

import java.util.UUID
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.core.java.javaUUID

object UserCategoryRel: Table("relation.user_category_rel") {
    val userId: Column<UUID> = javaUUID("user_id")
    val categoryId: Column<UUID> = javaUUID("category_id")
    val isDeleted: Column<Boolean> = bool("is_deleted").default(false)
}