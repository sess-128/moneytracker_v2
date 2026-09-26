package ru.rrtyui.moneytracker.services.usecase.model

import java.util.UUID

data class CategoryCreateCommand(
    val name: String,
    val type: CategoryTypeCommand,
    val parentId: UUID?
)