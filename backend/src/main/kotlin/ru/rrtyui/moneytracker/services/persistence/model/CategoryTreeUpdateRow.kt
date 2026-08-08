package ru.rrtyui.moneytracker.services.persistence.model

import java.util.UUID

data class CategoryTreeUpdateRow(
    val oldCategoryId: UUID,
    val newCategoryId: UUID,
    val actorId: UUID,
)