package ru.rrtyui.moneytracker.services.persistence.model

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class TransactionCreateRow(
    val categoryId: UUID,
    val transactionDateTime: LocalDateTime,
    val amount: BigDecimal,
    val description: String?,
    val actorId: UUID,
    val actorName: String,
)