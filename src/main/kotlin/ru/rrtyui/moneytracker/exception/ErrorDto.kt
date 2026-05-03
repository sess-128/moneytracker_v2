package ru.rrtyui.moneytracker.exception

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ErrorDto(
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val status: Int,
    val error: String,
    val message: String,
    val path: String,
    val details: List<FieldErrorDto>? = null
)

data class FieldErrorDto(
    val field: String,
    val rejectedValue: Any? = null,
    val message: String
)
