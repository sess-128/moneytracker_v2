package ru.rrtyui.moneytracker.client.api.v1

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springdoc.core.annotations.ParameterObject
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.client.RestConstants.ANALYTICS_URL
import ru.rrtyui.moneytracker.client.RestConstants.API_V1
import ru.rrtyui.moneytracker.client.mapper.TransactionControllerMapper.toParams
import ru.rrtyui.moneytracker.client.mapper.TransactionControllerMapper.toResponse
import ru.rrtyui.moneytracker.client.request.AnalyticsFilterRequest
import ru.rrtyui.moneytracker.client.response.AnalyticsFilterResponse
import ru.rrtyui.moneytracker.services.usecase.AnalyticsFilterUseCase

@RestController
@RequestMapping("$API_V1/$ANALYTICS_URL")
@Tag(name = "Аналитика", description = "Получение сводных данных для анализа трат и аналитики")
class AnalyticsController(
    private val analyticsFilterUseCase: AnalyticsFilterUseCase,
) {
    @GetMapping("/by-filter")
    @Operation(description = "Получить все транзакции пользователя по заданным фильтрам")
    fun getAnalyticsByFilter(
        @ParameterObject request: AnalyticsFilterRequest
    ): ResponseEntity<List<AnalyticsFilterResponse>> {
        val params = request.toParams()
        val result = analyticsFilterUseCase.invoke(params)
        val response = result.map { it.toResponse() }

        return ResponseEntity.ok(response)
    }
}