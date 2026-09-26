package ru.rrtyui.moneytracker.client.response

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID

data class FindCategoriesByUserResponse(
    @field:Schema(description = "Уникальный идентификатор категории", example = "123e4567-e89b-12d3-a456-426614174000")
    val categoryId: UUID,

    @field:Schema(description = "Название категории", example = "Продукты")
    val name: String,

    @field:Schema(description = "Тип категории", example = "EXPENSE", allowableValues = ["EXPENSE", "INCOME"])
    val type: CategoryTypeStatusResponse,

    val childCategories: List<FindCategoriesByUserResponse>
)