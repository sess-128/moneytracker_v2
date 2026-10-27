package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.client.response.AnalyticsSummaryResponse
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsSummaryParams

interface AnalyticsSummaryUseCase {
    fun invoke(params: AnalyticsSummaryParams): AnalyticsSummaryResponse
}