package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Pattern
import ru.rrtyui.moneytracker.client.utils.VALID_PASSWORD_REGEX

data class UserLoginRequest(
    @field:Schema(description = "Имя пользователя (логин)", example = "andrey_dev")
    @field:NotEmpty(message = "{validation.field.fullName.empty}")
    val username: String,

    @field:Schema(description = "Пароль пользователя", example = "StrongPass123!")
    @field:NotBlank(message = "{validation.field.password.blank}")
    @field:Pattern(
        regexp = VALID_PASSWORD_REGEX,
        message = "{validation.field.password.invalid}"
    )
    val password: String
)