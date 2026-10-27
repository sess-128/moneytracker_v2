package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_END_DATE
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_START_DATE

data class AnalyticsSummaryRequest(
    @field:Schema(description = ANALYTICS_START_DATE, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val startDate: LocalDate = LocalDate.of(2000,1,1),

    @field:Schema(description = ANALYTICS_END_DATE, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val endDate: LocalDate? = null,
)
