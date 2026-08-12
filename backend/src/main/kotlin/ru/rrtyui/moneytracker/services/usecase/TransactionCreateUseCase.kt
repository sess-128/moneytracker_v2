package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.TransactionCreateCommand
import ru.rrtyui.moneytracker.services.usecase.model.TransactionCreateResult

interface TransactionCreateUseCase {
    fun invoke(command: TransactionCreateCommand): TransactionCreateResult
}