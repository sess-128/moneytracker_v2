package ru.rrtyui.moneytracker.services.usecase.model

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class TransactionCreateCommand(
    val categoryId: UUID,
    val amount: BigDecimal,
    val description: String?,
    val transactionDate: LocalDateTime?
)