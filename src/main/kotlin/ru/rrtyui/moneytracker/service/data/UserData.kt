package ru.rrtyui.moneytracker.service.data

import java.util.UUID
import ru.rrtyui.moneytracker.entity.UserRole

data class UserData(
    val id: UUID,
    val username: String,
    val password: String,
    val email: String,
    val role: UserRole
)
