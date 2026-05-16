package ru.rrtyui.moneytracker.client.request

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryType

data class CategoryCreateRequest(
    val name: String,
    val type: CategoryType,
    val parentId: UUID?
)