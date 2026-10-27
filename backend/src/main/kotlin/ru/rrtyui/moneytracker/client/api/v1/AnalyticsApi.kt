package ru.rrtyui.moneytracker.client.api.v1

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springdoc.core.annotations.ParameterObject
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import ru.rrtyui.moneytracker.client.RestConstants.BY_FILTER
import ru.rrtyui.moneytracker.client.RestConstants.BY_TYPE
import ru.rrtyui.moneytracker.client.RestConstants.SUMMARY
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_API
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_DESCRIPTION
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_GET_SUMMARY
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_GET_SUMMARY_BY_FILTER
import ru.rrtyui.moneytracker.client.SwaggerConstants.ANALYTICS_GET_TYPED_SUMMARY
import ru.rrtyui.moneytracker.client.request.AnalyticsFilterRequest
import ru.rrtyui.moneytracker.client.request.AnalyticsSummaryRequest
import ru.rrtyui.moneytracker.client.request.AnalyticsTransactionsSummaryRequest
import ru.rrtyui.moneytracker.client.request.CategoryTypeStatusRequest
import ru.rrtyui.moneytracker.client.response.AnalyticsFilterResponse
import ru.rrtyui.moneytracker.client.response.AnalyticsSummaryResponse
import ru.rrtyui.moneytracker.client.response.AnalyticsTypedSummaryResponse

@Tag(name = ANALYTICS_API, description = ANALYTICS_DESCRIPTION)
interface AnalyticsApi {
    @GetMapping("/$SUMMARY/$BY_FILTER")
    @Operation(description = ANALYTICS_GET_SUMMARY_BY_FILTER)
    fun getAnalyticsByFilter(
        @ParameterObject request: AnalyticsFilterRequest
    ): ResponseEntity<List<AnalyticsFilterResponse>>

    @GetMapping("/$SUMMARY")
    @Operation(summary = ANALYTICS_GET_SUMMARY)
    fun getSummary(
        @ParameterObject @Valid request: AnalyticsSummaryRequest
    ): ResponseEntity<AnalyticsSummaryResponse>


    @GetMapping("/$SUMMARY/$BY_TYPE")
    @Operation(summary = ANALYTICS_GET_TYPED_SUMMARY)
    fun getTypedSummary(
        @RequestParam type: CategoryTypeStatusRequest,
        @ParameterObject @Valid request: AnalyticsTransactionsSummaryRequest
    ): ResponseEntity<AnalyticsTypedSummaryResponse>
}