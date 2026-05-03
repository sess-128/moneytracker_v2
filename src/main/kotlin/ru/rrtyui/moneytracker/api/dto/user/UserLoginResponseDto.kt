package ru.rrtyui.moneytracker.api.dto.user

data class UserLoginResponseDto(
    val login: String,
    val token: String
)
