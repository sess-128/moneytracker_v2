package ru.rrtyui.moneytracker.services.persistence.model

import java.util.UUID

data class CategoryTreeDeleteRow(
    val categoryId: UUID,
    val actorId: UUID,
)