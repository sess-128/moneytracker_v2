package ru.rrtyui.moneytracker.client.mapper

import ru.rrtyui.moneytracker.client.mapper.CategoryControllerMapper.toUseCase
import ru.rrtyui.moneytracker.client.request.AnalyticsFilterRequest
import ru.rrtyui.moneytracker.client.request.AnalyticsSummaryRequest
import ru.rrtyui.moneytracker.client.request.AnalyticsTransactionsSummaryRequest
import ru.rrtyui.moneytracker.client.request.CategoryTypeStatusRequest
import ru.rrtyui.moneytracker.client.response.AnalyticsFilterResponse
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterParams
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterResult
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsSummaryParams
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsTypedSummaryParams

object AnalyticsControllerMapper {
    fun AnalyticsFilterRequest.toParams() =
        AnalyticsFilterParams(
            categoryIds = this.categoryIds,
            startDate = this.startDate,
            endDate = this.endDate,
            minAmount = this.minAmount,
            maxAmount = this.maxAmount,
        )

    fun AnalyticsFilterResult.toResponse() =
        AnalyticsFilterResponse(
            categoryName = this.categoryName,
            amount = this.amount,
            countOfTransactions = this.countOfTransactions,
            avgInDay = this.avgInDay,
        )

    fun AnalyticsSummaryRequest.toUseCase() =
        AnalyticsSummaryParams(
            startDate = this.startDate,
            endDate = this.endDate,
        )

    fun AnalyticsTransactionsSummaryRequest.toUseCase(type: CategoryTypeStatusRequest) =
        AnalyticsTypedSummaryParams(
            categoryIds = this.categoryIds,
            type = type.toUseCase(),
            startDate = this.startDate,
            endDate = this.endDate,
            minAmount = this.minAmount,
            maxAmount = this.maxAmount,
        )
}