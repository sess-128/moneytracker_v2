package ru.rrtyui.moneytracker.dao

import org.springframework.security.core.GrantedAuthority

enum class UserRole : GrantedAuthority {
    ADMIN, USER;

    override fun getAuthority(): String = name
}