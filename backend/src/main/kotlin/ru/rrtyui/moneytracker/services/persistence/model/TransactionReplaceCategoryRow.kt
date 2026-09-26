package ru.rrtyui.moneytracker.services.persistence.model

import java.util.UUID

data class TransactionReplaceCategoryRow(
    val oldCategoryId: UUID,
    val newCategoryId: UUID,
    val newCategoryName: String,
    val actorId: UUID,
)