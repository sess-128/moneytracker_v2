package ru.rrtyui.moneytracker.services.service.model

import java.util.UUID

data class CategoryTreeCreateModel(
    val categoryId: UUID,
    val parentId: UUID?,
    val actorId: UUID,
)