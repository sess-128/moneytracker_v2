package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.client.response.AnalyticsTypedSummaryResponse
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsTypedSummaryParams

interface AnalyticsTypedSummaryUseCase {
    fun invoke(params: AnalyticsTypedSummaryParams): AnalyticsTypedSummaryResponse
}