package ru.rrtyui.moneytracker.api.dto.category

import ru.rrtyui.moneytracker.entity.CategoryType
import java.util.UUID

data class CategoryCreateDto(
    val name: String,
    val type: CategoryType,
    val parentId: UUID?
)