package ru.rrtyui.moneytracker.client.response

import io.swagger.v3.oas.annotations.media.Schema

data class UserInfoResponse(
    @field:Schema(description = "Уникальный идентификатор пользователя (UUID)", example = "123e4567-e89b-12d3-a456-426614174000")
    val id: String,

    @field:Schema(description = "Логин пользователя", example = "andrey_dev")
    val login: String
)
