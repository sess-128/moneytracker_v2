package ru.rrtyui.moneytracker.services.usecase.mapper

import java.util.UUID
import ru.rrtyui.moneytracker.services.service.model.AnalyticsFilterServiceModel
import ru.rrtyui.moneytracker.services.service.model.FilterTransactionServiceModel
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterParams
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterResult

object AnalyticsMapper {
    fun AnalyticsFilterParams.toServiceModel(actorId: UUID) =
        FilterTransactionServiceModel(
            categoryIds = this.categoryIds,
            startDate = this.startDate,
            endDate = this.endDate,
            minAmount = this.minAmount,
            maxAmount = this.maxAmount,
            actorId = actorId,
        )

    fun AnalyticsFilterServiceModel.toResult() =
        AnalyticsFilterResult(
            categoryName = this.categoryName,
            amount = this.amount,
            countOfTransactions = this.countOfTransactions,
            avgInDay = this.avgInDay,
        )
}