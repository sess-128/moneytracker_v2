package ru.rrtyui.moneytracker.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.entity.Categories
import ru.rrtyui.moneytracker.entity.CategoryTree

fun ResultRow.toCategoryDto() =
    CategoryResponse(
        id = this[Categories.id].value,
        name = this[Categories.name],
        type = this[Categories.type],
        parentId = this[CategoryTree.parentId]?.value
    )