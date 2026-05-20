package ru.rrtyui.moneytracker.entity

import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.springframework.security.core.GrantedAuthority

object Users: UUIDTable("storage.users") {
    val username: Column<String> = varchar("username", 128)
    val password: Column<String> = varchar("password", 128)
    val email: Column<String> = varchar("email", 255)
    val role: Column<UserRole> = enumerationByName<UserRole>("roles", 20)
}

enum class UserRole : GrantedAuthority {
    ADMIN, USER;

    override fun getAuthority(): String = name
}