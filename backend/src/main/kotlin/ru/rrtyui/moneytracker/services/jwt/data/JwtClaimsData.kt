package ru.rrtyui.moneytracker.services.jwt.data

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.tables.UserRole

data class JwtClaimsData(
    val userId: UUID,
    val username: String,
    val role: UserRole,
    val type: String
)