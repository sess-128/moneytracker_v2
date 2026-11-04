package ru.rrtyui.moneytracker.services.web

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.client.RestConstants.ANALYTICS_URL
import ru.rrtyui.moneytracker.client.RestConstants.API_V1
import ru.rrtyui.moneytracker.client.api.v1.AnalyticsApi
import ru.rrtyui.moneytracker.client.mapper.AnalyticsControllerMapper.toParams
import ru.rrtyui.moneytracker.client.mapper.AnalyticsControllerMapper.toResponse
import ru.rrtyui.moneytracker.client.mapper.AnalyticsControllerMapper.toUseCase
import ru.rrtyui.moneytracker.client.request.AnalyticsFilterRequest
import ru.rrtyui.moneytracker.client.request.AnalyticsSummaryRequest
import ru.rrtyui.moneytracker.client.request.AnalyticsTransactionsSummaryRequest
import ru.rrtyui.moneytracker.client.request.CategoryTypeStatusRequest
import ru.rrtyui.moneytracker.client.response.AnalyticsFilterResponse
import ru.rrtyui.moneytracker.client.response.AnalyticsSummaryResponse
import ru.rrtyui.moneytracker.client.response.AnalyticsTypedSummaryResponse
import ru.rrtyui.moneytracker.services.usecase.AnalyticsFilterUseCase
import ru.rrtyui.moneytracker.services.usecase.AnalyticsSummaryUseCase
import ru.rrtyui.moneytracker.services.usecase.AnalyticsTypedSummaryUseCase

@RestController
@RequestMapping("${API_V1}/${ANALYTICS_URL}")
class AnalyticsController(
    private val analyticsFilterUseCase: AnalyticsFilterUseCase,
    private val analyticsSummaryUseCase: AnalyticsSummaryUseCase,
    private val analyticsTypedSummaryUseCase: AnalyticsTypedSummaryUseCase,
): AnalyticsApi {

    override fun getAnalyticsByFilter(
        request: AnalyticsFilterRequest
    ): ResponseEntity<List<AnalyticsFilterResponse>> {
        val params = request.toParams()
        val result = analyticsFilterUseCase.invoke(params)
        val response = result.map { it.toResponse() }

        return ResponseEntity.ok(response)
    }

    override fun getSummary(
        request: AnalyticsSummaryRequest
    ): ResponseEntity<AnalyticsSummaryResponse> {
        val params = request.toUseCase()
        val result = analyticsSummaryUseCase.invoke(params)

        return ResponseEntity.ok(result)
    }

    override fun getTypedSummary(
        type: CategoryTypeStatusRequest,
        request: AnalyticsTransactionsSummaryRequest
    ): ResponseEntity<AnalyticsTypedSummaryResponse> {
        val params = request.toUseCase(type)
        val result = analyticsTypedSummaryUseCase.invoke(params)

        return ResponseEntity.ok(result)
    }
}