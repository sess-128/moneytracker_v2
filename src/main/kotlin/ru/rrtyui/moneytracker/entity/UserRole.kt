package ru.rrtyui.moneytracker.entity

import org.springframework.security.core.GrantedAuthority

enum class UserRole : GrantedAuthority {
    ADMIN, USER;

    override fun getAuthority(): String = name
}