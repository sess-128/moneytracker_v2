package ru.rrtyui.moneytracker.service.data

import ru.rrtyui.moneytracker.entity.UserRole
import java.util.UUID

data class UserPrincipal(
    val id: UUID,
    val username: String,
    val role: UserRole
)