package ru.rrtyui.moneytracker.api.dto.transaction

import java.time.LocalDate
import java.math.BigDecimal

data class TransactionRequestDto(
    val categoryName: String,
    val amount : BigDecimal,
    val description : String,
    val startDate: LocalDate,
    val endDate: LocalDate,
)
