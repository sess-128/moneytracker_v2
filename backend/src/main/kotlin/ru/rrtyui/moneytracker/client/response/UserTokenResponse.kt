package ru.rrtyui.moneytracker.client.response

import io.swagger.v3.oas.annotations.media.Schema

data class UserTokenResponse(
    @field:Schema(description = "JWT токен доступа (Access Token)", example = "eyJhbGciOiJIUzI1NiJ9...")
    val token: String
)
