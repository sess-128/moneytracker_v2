package ru.rrtyui.moneytracker.api.dto.transaction

import java.math.BigDecimal
import java.time.LocalDate

data class TransactionRequestDto(
    val categoryName: String,
    val amount : BigDecimal,
    val description : String, // TODO Почему дескрипшн обязательный и уникальный констреинт?
    val startDate: LocalDate,
    val endDate: LocalDate,
)
