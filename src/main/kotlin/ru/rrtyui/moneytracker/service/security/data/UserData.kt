package ru.rrtyui.moneytracker.service.security.data

import ru.rrtyui.moneytracker.dao.UserRole
import java.util.UUID

data class UserData(
    val id: UUID,
    val username: String,
    val password: String,
    val email: String,
    val role: UserRole
)
