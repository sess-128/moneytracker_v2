package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterParams
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterResult

interface AnalyticsFilterUseCase {
    fun invoke(params: AnalyticsFilterParams): List<AnalyticsFilterResult>
}