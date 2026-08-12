package ru.rrtyui.moneytracker.services.usecase.model

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class TransactionCreateResult(
    val id: UUID,
    val categoryId: UUID,
    val type: CategoryTypeCommand,
    val amount: BigDecimal,
    val description: String?,
    val transactionDate: LocalDateTime?
)