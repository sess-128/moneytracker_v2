package ru.rrtyui.moneytracker.api.dto.category

import ru.rrtyui.moneytracker.entity.CategoryType

data class CategoryCreateDto(
    val name: String,
    val type: CategoryType
)