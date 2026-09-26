package ru.rrtyui.moneytracker.services.usecase.model

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class FindTransactionsResult(
    val id: UUID,
    val categoryId: UUID,
    val actorId: UUID,
    val transactionDate: LocalDateTime,
    val amount: BigDecimal,
    val description: String?,
)