package ru.rrtyui.moneytracker.dao

import org.jetbrains.exposed.v1.core.dao.id.IdTable

object UserTable : IdTable<Long>("user") {
    override val id = long("user_id").entityId()
    val name = varchar("user_name", 255)
}