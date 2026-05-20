package ru.rrtyui.moneytracker.api.dto.transaction

import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID

data class TransactionResponseDto(
    val id: UUID,
    val categoryName: String,
    val userName: String,
    val amount : BigDecimal,
    val description : String,
    val startDate: LocalDate,
    val endDate: LocalDate,
)
