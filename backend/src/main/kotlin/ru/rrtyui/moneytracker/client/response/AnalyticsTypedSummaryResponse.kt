package ru.rrtyui.moneytracker.client.response

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_AVERAGE
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_CATEGORY_ID
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_CATEGORY_NAME
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_ITEMS
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_MAX_FOR_MONTH
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_PERCENTAGE
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_SUM
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_SUMMARY
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_TRANSACTIONS
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_TRANSACTION_AMOUNT
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_TRANSACTION_DATE
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_TRANSACTION_DESCRIPTION
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_TRANSACTION_ID
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_TYPED_SUMMARY

data class AnalyticsTypedSummaryResponse(
     @field:Schema(description = ANALYTICS_TYPED_SUMMARY)
     val summary: TypedSummary,
     @field:Schema(description = ANALYTICS_TRANSACTIONS)
     val transactions: List<TransactionGroup>
)

data class TransactionGroup(
     @field:Schema(description = ANALYTICS_CATEGORY_ID)
     val categoryId: UUID,
     @field:Schema(description = ANALYTICS_CATEGORY_NAME)
     val categoryName: String,
     @field:Schema(description = ANALYTICS_SUMMARY)
     val summary: TypedSummary,
     @field:Schema(description = ANALYTICS_ITEMS)
     val items: List<TransactionItem>,
     @field:Schema(description = "Дочерние категории")
     val childCategories: List<TransactionGroup> = emptyList()
)

data class TransactionItem(
     @field:Schema(description = ANALYTICS_TRANSACTION_ID)
     val id: UUID,
     @field:Schema(description = ANALYTICS_CATEGORY_ID)
     val categoryId: UUID,
     @field:Schema(description = ANALYTICS_CATEGORY_NAME)
     val categoryName: String,
     @field:Schema(description = ANALYTICS_TRANSACTION_AMOUNT)
     val amount: BigDecimal,
     @field:Schema(description = ANALYTICS_TRANSACTION_DESCRIPTION)
     val description: String?,
     @field:Schema(description = ANALYTICS_TRANSACTION_DATE)
     val transactionDate: LocalDateTime
)

data class TypedSummary(
     @field:Schema(description = ANALYTICS_SUM)
     val sum: BigDecimal,
     @field:Schema(description = ANALYTICS_PERCENTAGE)
     val percentage: Float,
     @field:Schema(description = ANALYTICS_MAX_FOR_MONTH)
     val maxForMonth: BigDecimal,
     @field:Schema(description = ANALYTICS_AVERAGE)
     val average: BigDecimal
)