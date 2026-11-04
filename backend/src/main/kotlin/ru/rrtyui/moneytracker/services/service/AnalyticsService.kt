package ru.rrtyui.moneytracker.services.service

import ru.rrtyui.moneytracker.services.service.model.AnalyticsFilterServiceModel
import ru.rrtyui.moneytracker.services.service.model.FilterTransactionServiceModel

interface AnalyticsService {
    fun getAnalyticsByFilter(filterParams: FilterTransactionServiceModel): List<AnalyticsFilterServiceModel>
}