package ru.rrtyui.moneytracker.services.service.model

import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID

data class FilterTransactionServiceModel(
    val categoryIds: List<UUID> = emptyList(),
    val startDate: LocalDate ,
    val endDate: LocalDate? = null,
    val minAmount: BigDecimal = BigDecimal.ZERO,
    val maxAmount: BigDecimal? = null,
    val actorId: UUID,
    )