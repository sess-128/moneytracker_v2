package ru.rrtyui.moneytracker.services.service.model

import java.util.UUID

data class CategoryTreeUpdateRootModel(
    val categoryId: UUID,
    val newRootId: UUID,
    val actorId: UUID,
)