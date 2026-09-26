package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.TransactionFilterParams
import ru.rrtyui.moneytracker.services.usecase.model.TransactionResult

interface FilteredTransactionUseCase {
    fun invoke(params: TransactionFilterParams): List<TransactionResult>
}