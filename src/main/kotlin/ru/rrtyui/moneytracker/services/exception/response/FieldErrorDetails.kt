package ru.rrtyui.moneytracker.services.exception.response

data class FieldErrorDetails(
    val field: String,
    val rejectedValue: Any? = null,
    val message: String
)
