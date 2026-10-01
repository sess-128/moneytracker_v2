package ru.rrtyui.moneytracker.services.service

import java.util.UUID
import ru.rrtyui.moneytracker.services.service.model.AnalyticsFilterServiceModel
import ru.rrtyui.moneytracker.services.service.model.FilterTransactionServiceModel
import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.service.model.TransactionReplaceCategoryModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel

interface TransactionService {
    fun create(createModel: TransactionCreateModel): TransactionServiceModel

    fun findAllByUserId(userId: UUID): List<TransactionServiceModel>

    fun replaceCategoryWithNew(replaceCategoryModel: TransactionReplaceCategoryModel)

    fun filterTransaction(filterParams: FilterTransactionServiceModel): List<AnalyticsFilterServiceModel>
}