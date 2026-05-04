package ru.rrtyui.moneytracker.dao

import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable

object UserTable: UUIDTable("storage.users") {
    val username = varchar("username", 128)
    val password = varchar("password", 128)
    val email = varchar("email", 255)
    val role = enumeration("roles", UserRole::class)
}