package ru.rrtyui.moneytracker.api.dto.user

data class UserRegistrationRequestDto(
    val username: String,
    val password: String,
    val email: String
)
