package ru.rrtyui.moneytracker.services.service.model

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class TransactionCreateModel(
    val categoryId: UUID,
    val transactionDateTime: LocalDateTime? = LocalDateTime.now(),
    val amount: BigDecimal,
    val description: String?,
    val actorId: UUID,
    val actorName: String,
)