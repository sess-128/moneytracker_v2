package ru.rrtyui.moneytracker.services.exception.response

import com.fasterxml.jackson.annotation.JsonInclude
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ErrorResponse(
    @field:Schema(description = "Временная метка возникновения ошибки", example = "2023-10-25T14:30:00")
    val timestamp: LocalDateTime = LocalDateTime.now(),

    @field:Schema(description = "HTTP статус код ошибки", example = "400")
    val status: Int,

    @field:Schema(description = "Тип ошибки (reason phrase)", example = "Bad Request")
    val error: String,

    @field:Schema(description = "Сообщение об ошибке", example = "Validation failed for argument")
    val message: String,

    @field:Schema(description = "Путь запроса, вызвавшего ошибку", example = "/api/auth/register")
    val path: String,

    @field:Schema(description = "Список деталей ошибок валидации полей (если есть)")
    val details: List<FieldErrorDetails>? = null
)