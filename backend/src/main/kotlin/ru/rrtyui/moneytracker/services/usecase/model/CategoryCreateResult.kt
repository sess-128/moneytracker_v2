package ru.rrtyui.moneytracker.services.usecase.model

import java.util.UUID

data class CategoryCreateResult(
    val categoryId: UUID,
    val linkId: UUID,
    val parentId: UUID?,
    val name: String,
    val type: CategoryTypeCommand
)