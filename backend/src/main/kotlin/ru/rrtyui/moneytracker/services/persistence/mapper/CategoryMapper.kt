package ru.rrtyui.moneytracker.services.persistence.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.services.persistence.tables.CategoriesTable
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryTreeTable

fun ResultRow.toCategoryDto() =
    CategoryResponse(
        id = this[CategoriesTable.id].value,
        name = this[CategoriesTable.name],
        type = this[CategoriesTable.type],
        parentId = this[CategoryTreeTable.parentId]?.value
    )