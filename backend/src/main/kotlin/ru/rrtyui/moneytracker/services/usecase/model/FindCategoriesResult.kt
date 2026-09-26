package ru.rrtyui.moneytracker.services.usecase.model

import java.util.UUID

data class FindCategoriesResult(
    val categoryId: UUID,
    val name: String,
    val type: CategoryTypeCommand,
    val childCategories: List<FindCategoriesResult>
)