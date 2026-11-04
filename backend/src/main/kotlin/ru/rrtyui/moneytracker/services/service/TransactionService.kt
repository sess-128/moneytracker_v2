package ru.rrtyui.moneytracker.services.service

import java.util.UUID
import ru.rrtyui.moneytracker.services.service.model.FilterTransactionServiceModel
import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.service.model.TransactionCursor
import ru.rrtyui.moneytracker.services.service.model.TransactionPageServiceModel
import ru.rrtyui.moneytracker.services.service.model.TransactionReplaceCategoryModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel

interface TransactionService {
    fun create(createModel: TransactionCreateModel): TransactionServiceModel

    fun findAllByUserId(userId: UUID): List<TransactionServiceModel>

    fun findPageByUserId(
        userId: UUID,
        cursor: TransactionCursor?
    ): TransactionPageServiceModel

    fun replaceCategoryWithNew(replaceCategoryModel: TransactionReplaceCategoryModel)

    fun filterTransaction(filterParams: FilterTransactionServiceModel): List<TransactionServiceModel>

    fun deleteById(transactionId: UUID)
}