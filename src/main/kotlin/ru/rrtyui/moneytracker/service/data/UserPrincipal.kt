package ru.rrtyui.moneytracker.service.data

import java.util.UUID
import ru.rrtyui.moneytracker.entity.UserRole

data class UserPrincipal(
    val id: UUID,
    val username: String,
    val role: UserRole
)