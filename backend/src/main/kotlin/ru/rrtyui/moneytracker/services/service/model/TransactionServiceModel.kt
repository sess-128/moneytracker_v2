package ru.rrtyui.moneytracker.services.service.model

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class TransactionServiceModel(
    val id: UUID,
    val categoryId: UUID,
    val categoryName: String,
    val transactionDate: LocalDateTime? = LocalDateTime.now(),
    val amount: BigDecimal,
    val description: String?,
    val actorId: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
    )