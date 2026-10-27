package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_END_DATE
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_START_DATE
import ru.rrtyui.moneytracker.client.SwaggerConstants.CATEGORY_IDS
import ru.rrtyui.moneytracker.client.SwaggerConstants.MAX_AMOUNT
import ru.rrtyui.moneytracker.client.SwaggerConstants.MIN_AMOUNT

data class AnalyticsTransactionsSummaryRequest(
    @field:Schema(description = ANALYTICS_START_DATE, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val startDate: LocalDate = LocalDate.of(2000,1,1),

    @field:Schema(description = ANALYTICS_END_DATE, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val endDate: LocalDate? = null,

    @field:Schema(description = MIN_AMOUNT, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val minAmount: BigDecimal = BigDecimal.ZERO,

    @field:Schema(description = MAX_AMOUNT, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val maxAmount: BigDecimal? = null,

    @field:Schema(description = CATEGORY_IDS, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val categoryIds: List<UUID> = emptyList(),
)
