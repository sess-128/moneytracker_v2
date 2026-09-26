package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.TransactionResult

interface FindTransactionsByUserUseCase {
    fun invoke(): List<TransactionResult>
}