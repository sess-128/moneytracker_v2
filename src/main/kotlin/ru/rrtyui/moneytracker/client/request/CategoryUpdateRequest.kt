package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema

data class CategoryUpdateRequest(
    @field:Schema(description = "Новое название категории", example = "Продукты и хозяйство")
    val name: String
)
