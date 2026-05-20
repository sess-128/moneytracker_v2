package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Pattern
import ru.rrtyui.moneytracker.client.utils.VALID_EMAIL_ADDRESS_REGEX_WITH_EMPTY_SPACES_ACCEPTANCE
import ru.rrtyui.moneytracker.client.utils.VALID_PASSWORD_REGEX

data class UserRegistrationRequest(
    @field:NotEmpty(message = "{validation.field.fullName.empty}")
    @field:Schema(description = "Имя пользователя (логин)", example = "cist-yana")
    val username: String,
    @field:NotBlank(message = "{validation.field.password.blank}")
    @field:Pattern(
        regexp = VALID_PASSWORD_REGEX,
        message = "{validation.field.password.invalid}"
    )
    @field:Schema(description = "Пароль. Должен содержать минимум 8 символов, включая буквы и цифры", example = "StrongPass123!")
    val password: String,
    @field:NotBlank(message = "{validation.field.email.blank}")
    @field:Email(message = "{validation.field.email.invalid-format}")
    @field:Pattern(
        regexp = VALID_EMAIL_ADDRESS_REGEX_WITH_EMPTY_SPACES_ACCEPTANCE,
        message = "{validation.field.email.invalid-format.cyrillic.not.allowed}"
    )
    @field:Schema(description = "Email адрес пользователя", example = "lena@golovach.cto")
    val email: String
)
