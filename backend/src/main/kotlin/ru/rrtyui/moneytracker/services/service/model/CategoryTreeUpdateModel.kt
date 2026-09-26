package ru.rrtyui.moneytracker.services.service.model

import java.util.UUID

data class CategoryTreeUpdateModel(
    val oldCategoryId: UUID,
    val newCategoryId: UUID,
    val actorId: UUID,
)