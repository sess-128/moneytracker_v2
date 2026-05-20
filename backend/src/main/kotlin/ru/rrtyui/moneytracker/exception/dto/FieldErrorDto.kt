package ru.rrtyui.moneytracker.exception.dto

data class FieldErrorDto(
    val field: String,
    val rejectedValue: Any? = null,
    val message: String
)
