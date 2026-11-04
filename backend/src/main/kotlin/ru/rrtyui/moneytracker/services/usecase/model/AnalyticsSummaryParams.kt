package ru.rrtyui.moneytracker.services.usecase.model

import java.time.LocalDate

data class AnalyticsSummaryParams(
    val startDate: LocalDate,
    val endDate: LocalDate? = null,
)
