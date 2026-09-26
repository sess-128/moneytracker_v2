package ru.rrtyui.moneytracker.services.persistence.model

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryTableType

data class CategoryCreateRow(
    val name: String,
    val type: CategoryTableType,
    val actorId: UUID,
    val actorName: String,
)