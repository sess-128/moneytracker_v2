package ru.rrtyui.moneytracker.services.security.data

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.tables.UserRole

data class UserData(
    val id: UUID,
    val username: String,
    val password: String,
    val email: String,
    val role: UserRole
)
