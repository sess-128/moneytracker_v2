package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryType

data class CategoryCreateRequest(
    @field:Schema(description = "Название категории", example = "Продукты")
    val name: String,

    @field:Schema(description = "Тип категории", example = "EXPENSE", allowableValues = ["EXPENSE", "INCOME"])
    val type: CategoryType,

    @field:Schema(description = "ID родительской категории, если это подкатегория", example = "123e4567-e89b-12d3-a456-426614174000")
    val parentId: UUID?
)