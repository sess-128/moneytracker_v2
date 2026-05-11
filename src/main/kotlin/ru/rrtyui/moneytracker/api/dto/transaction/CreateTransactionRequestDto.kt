package ru.rrtyui.moneytracker.api.dto.transaction

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID


data class CreateTransactionRequestDto(
    val categoryId: UUID,
    val amount : BigDecimal,
    val description : String?,
    val transactionDate: LocalDateTime?
)
