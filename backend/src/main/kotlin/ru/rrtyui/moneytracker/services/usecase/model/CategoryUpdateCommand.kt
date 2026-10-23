package ru.rrtyui.moneytracker.services.usecase.model

import java.util.UUID

data class CategoryUpdateCommand(
    val name: String,
    val categoryId: UUID,
    val categoryRoot: UUID?,
)