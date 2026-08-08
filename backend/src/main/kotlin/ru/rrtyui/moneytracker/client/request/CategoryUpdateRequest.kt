package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID

data class CategoryUpdateRequest(
    @field:Schema(description = "Новое название категории", example = "Продукты и хозяйство")
    val name: String,

    @field:Schema(description = "ID обновляемой категории", example = "123e4567-e89b-12d3-a456-426614174000")
    val oldCategoryId: UUID,
)
