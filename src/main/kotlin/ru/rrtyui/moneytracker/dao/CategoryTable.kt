package ru.rrtyui.moneytracker.dao


import org.jetbrains.exposed.dao.id.IdTable


object CategoryTable : IdTable<Long>("category") {
    override val id = long("category_id").entityId()
    val category_name = varchar("category_name", 255)
    val category_description = varchar("category_description", 255)
}