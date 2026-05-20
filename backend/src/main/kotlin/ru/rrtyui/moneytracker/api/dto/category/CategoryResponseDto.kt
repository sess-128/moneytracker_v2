package ru.rrtyui.moneytracker.api.dto.category

import java.util.UUID
import ru.rrtyui.moneytracker.entity.CategoryType

data class CategoryResponseDto(
    val id: UUID,
    val name: String,
    val type: CategoryType,
    val parentId: UUID?
)