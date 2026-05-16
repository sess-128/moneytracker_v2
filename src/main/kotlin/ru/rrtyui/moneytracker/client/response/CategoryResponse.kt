package ru.rrtyui.moneytracker.client.response

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryType

data class CategoryResponse(
    val id: UUID,
    val name: String,
    val type: CategoryType,
    val parentId: UUID?
)