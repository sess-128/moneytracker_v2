package ru.rrtyui.moneytracker.services.service.model

import java.util.UUID

data class TransactionReplaceCategoryModel(
    val oldCategoryId: UUID,
    val newCategoryId: UUID,
    val newCategoryName: String,
    val actorId: UUID,
)