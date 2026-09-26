package ru.rrtyui.moneytracker.services.service.model

import java.time.LocalDateTime
import java.util.UUID

data class CategoryServiceModel(
    val id: UUID,
    val name: String,
    val type: CategoryTypeModel,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)