package ru.rrtyui.moneytracker.services.service.model

import java.util.UUID

data class ActorPrincipal(
    val id: UUID,
    val username: String,
)