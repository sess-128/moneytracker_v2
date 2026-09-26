package ru.rrtyui.moneytracker.application.security.data

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.tables.UserRole

data class UserPrincipal(
    val id: UUID,
    val username: String,
    val role: UserRole
)