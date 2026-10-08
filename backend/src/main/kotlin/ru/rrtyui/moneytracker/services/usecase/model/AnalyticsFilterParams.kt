package ru.rrtyui.moneytracker.services.usecase.model

import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID

data class AnalyticsFilterParams(
    val categoryIds: List<UUID>,
    val startDate: LocalDate,
    val endDate: LocalDate? = null,
    val minAmount: BigDecimal,
    val maxAmount: BigDecimal? = null,
)
