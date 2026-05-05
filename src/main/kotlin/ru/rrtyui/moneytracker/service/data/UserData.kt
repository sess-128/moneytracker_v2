package ru.rrtyui.moneytracker.service.data

import ru.rrtyui.moneytracker.entity.UserRole
import java.util.UUID

data class UserData(
    val id: UUID,
    val username: String,
    val password: String,
    val email: String,
    val role: UserRole
)
