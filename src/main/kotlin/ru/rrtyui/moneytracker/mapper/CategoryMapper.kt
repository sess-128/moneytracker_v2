package ru.rrtyui.moneytracker.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.api.dto.category.CategoryResponseDto
import ru.rrtyui.moneytracker.entity.Categories

fun ResultRow.toCategoryDto() =
    CategoryResponseDto(
        id = this[Categories.id].value,
        name = this[Categories.name],
        type = this[Categories.type],
    )