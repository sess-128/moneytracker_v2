package ru.rrtyui.moneytracker.services.service.model

import java.math.BigDecimal

data class AnalyticsFilterServiceModel(
     val categoryName: String,
     val amount: String,
     val countOfTransactions: Int,
     val avgInDay: BigDecimal,
)
