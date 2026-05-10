package ru.rrtyui.moneytracker.service.data

import java.math.BigDecimal
import java.util.UUID
import kotlinx.datetime.LocalDate

data class TransactionData(
    val id: UUID,
    val categoryName: String,
    val userName: String,
    val amount : BigDecimal,
    val description : String,
    val startDate: LocalDate,
    val endDate: LocalDate,
)
