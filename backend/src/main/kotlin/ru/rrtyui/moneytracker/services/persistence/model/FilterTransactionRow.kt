package ru.rrtyui.moneytracker.services.persistence.model

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class FilterTransactionRow(
    val categoryIds: List<UUID>,
    val startDate: LocalDateTime,
    val endDate: LocalDateTime?,
    val minAmount: BigDecimal,
    val maxAmount: BigDecimal?,
    val actorId: UUID,
    )