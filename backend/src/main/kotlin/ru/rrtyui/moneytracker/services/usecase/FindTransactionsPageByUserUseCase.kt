package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.TransactionPageResult

interface FindTransactionsPageByUserUseCase {
    fun invoke(cursor: String?): TransactionPageResult
}