package ru.rrtyui.moneytracker.services.usecase.model

import java.util.UUID

data class CategoryUpdateCommand(
    val oldCategoryId: UUID,
    val name: String,
)