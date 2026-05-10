package ru.rrtyui.moneytracker.service.data

import ru.rrtyui.moneytracker.entity.UserRole
import java.util.UUID

data class JwtClaimsData(
    val userId: UUID,
    val username: String,
    val role: UserRole,
    val type: String
)
