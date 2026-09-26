package ru.rrtyui.moneytracker.services.persistence.model

import java.util.UUID

data class CategoryTreeCreateRow(
    val categoryId: UUID,
    val parentId: UUID?,
    val actorId: UUID,
)