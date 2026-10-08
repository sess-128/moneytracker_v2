package ru.rrtyui.moneytracker.client.response

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class AnalyticsFilterResponse(
     @field:Schema(description = "Название категории", example = "Продукты")
     val categoryName: String,

     @field:Schema(description = "Количество средств потраченных на категорию", example = "12000")
     val amount: String,

     @field:Schema(description = "Количество транзакций на категорию за период времени", example = "12")
     val countOfTransactions: Int,

     @field:Schema(description = "Среднее траты в день на категорию", example = "124.56")
     val avgInDay: BigDecimal,
)
