package ru.rrtyui.moneytracker.services.persistence.tables

import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable

object UsersTable: UUIDTable("storage.users") {
    val username: Column<String> = varchar("username", 128)
    val password: Column<String> = varchar("password", 128)
    val email: Column<String> = varchar("email", 255)
    val role: Column<UserRole> = enumerationByName<UserRole>("roles", 20)
}