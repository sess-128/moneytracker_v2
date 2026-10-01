package ru.rrtyui.moneytracker.services.usecase.model

import java.math.BigDecimal

data class AnalyticsFilterResult(
     val categoryName: String,
     val amount: String,
     val countOfTransactions: Int,
     val avgInDay: BigDecimal,
)
