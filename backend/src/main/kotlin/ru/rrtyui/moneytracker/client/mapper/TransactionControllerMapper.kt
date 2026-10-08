package ru.rrtyui.moneytracker.client.mapper

import ru.rrtyui.moneytracker.client.mapper.CategoryControllerMapper.toResponse
import ru.rrtyui.moneytracker.client.request.AnalyticsFilterRequest
import ru.rrtyui.moneytracker.client.request.TransactionCreateRequest
import ru.rrtyui.moneytracker.client.response.AnalyticsFilterResponse
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterParams
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterResult
import ru.rrtyui.moneytracker.services.usecase.model.TransactionCreateCommand
import ru.rrtyui.moneytracker.services.usecase.model.TransactionResult

object TransactionControllerMapper {
    fun TransactionCreateRequest.toCommand() =
        TransactionCreateCommand(
            categoryId = this.categoryId,
            categoryName = this.categoryName,
            amount = this.amount,
            description = this.description,
            transactionDate = this.transactionDate,
        )

    fun TransactionResult.toResponse() =
        TransactionResponse(
            id = this.id,
            categoryId = this.categoryId,
            categoryName = this.categoryName,
            type = this.type.toResponse(),
            amount = this.amount,
            description = this.description,
            transactionDate = this.transactionDate,
        )

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
}