package ru.rrtyui.moneytracker.services.persistence.tables

import org.springframework.security.core.GrantedAuthority

enum class UserRole : GrantedAuthority {
    ADMIN, USER;

    override fun getAuthority(): String = name
}