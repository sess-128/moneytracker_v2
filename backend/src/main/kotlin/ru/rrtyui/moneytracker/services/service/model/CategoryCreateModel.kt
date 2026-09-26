package ru.rrtyui.moneytracker.services.service.model

import java.util.UUID

data class CategoryCreateModel(
    val name: String,
    val type: CategoryTypeModel,
    val actorId: UUID,
    val actorName: String,
)