package ru.rrtyui.moneytracker.client.response

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_BALANCE
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_EXPENSE
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_INCOME
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_MONTH
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_MONTHS
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_SAVINGS
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_SUMMARY
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_YEAR
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_YEARS

data class AnalyticsSummaryResponse(
     @field:Schema(description = ANALYTICS_YEARS)
     val years: List<YearSummary>
)

data class YearSummary(
     @field:Schema(description = ANALYTICS_YEAR)
     val year: Int,
     @field:Schema(description = ANALYTICS_MONTHS)
     val months: List<MonthSummary>,
     @field:Schema(description = ANALYTICS_SUMMARY)
     val summary: Summary
)

data class MonthSummary(
     @field:Schema(description = ANALYTICS_MONTH)
     val month: Int,
     @field:Schema(description = ANALYTICS_SUMMARY)
     val summary: Summary
)

data class Summary(
     @field:Schema(description = ANALYTICS_INCOME)
     val income: BigDecimal,
     @field:Schema(description = ANALYTICS_EXPENSE)
     val expense: BigDecimal,
     @field:Schema(description = ANALYTICS_SAVINGS)
     val savings: BigDecimal,
     @field:Schema(description = ANALYTICS_BALANCE)
     val balance: BigDecimal
)