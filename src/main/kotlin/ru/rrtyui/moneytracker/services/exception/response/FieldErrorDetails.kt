package ru.rrtyui.moneytracker.services.exception.response

import io.swagger.v3.oas.annotations.media.Schema

data class FieldErrorDetails(
    @field:Schema(description = "Имя поля, в котором произошла ошибка", example = "email")
    val field: String,

    @field:Schema(description = "Отклоненное значение поля", example = "invalid-email")
    val rejectedValue: Any? = null,

    @field:Schema(description = "Сообщение об ошибке валидации", example = "Неверный формат email адреса")
    val message: String
)