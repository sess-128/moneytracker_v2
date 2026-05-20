package ru.rrtyui.moneytracker.service.data

import java.util.UUID
import ru.rrtyui.moneytracker.entity.UserRole

data class JwtClaimsData(
    val userId: UUID,
    val username: String,
    val role: UserRole,
    val type: String
)
