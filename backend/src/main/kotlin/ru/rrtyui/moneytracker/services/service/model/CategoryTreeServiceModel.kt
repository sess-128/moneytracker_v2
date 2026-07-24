package ru.rrtyui.moneytracker.services.service.model

import java.util.UUID

data class CategoryTreeServiceModel(
    val id: UUID,
    val categoryId: UUID,
    val parentId: UUID?,
)