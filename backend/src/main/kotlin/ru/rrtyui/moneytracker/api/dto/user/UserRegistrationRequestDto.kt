package ru.rrtyui.moneytracker.api.dto.user

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Pattern
import ru.rrtyui.moneytracker.utils.VALID_EMAIL_ADDRESS_REGEX_WITH_EMPTY_SPACES_ACCEPTANCE
import ru.rrtyui.moneytracker.utils.VALID_PASSWORD_REGEX

data class UserRegistrationRequestDto(
    @field:NotEmpty(message = "{validation.field.fullName.empty}")
    val username: String,
    @field:NotBlank(message = "{validation.field.password.blank}")
    @field:Pattern(
        regexp = VALID_PASSWORD_REGEX,
        message = "{validation.field.password.invalid}"
    )
    val password: String,
    @field:NotBlank(message = "{validation.field.email.blank}")
    @field:Email(message = "{validation.field.email.invalid-format}")
    @field:Pattern(
        regexp = VALID_EMAIL_ADDRESS_REGEX_WITH_EMPTY_SPACES_ACCEPTANCE,
        message = "{validation.field.email.invalid-format.cyrillic.not.allowed}"
    )
    val email: String
)
