package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.TransactionCreateCommand
import ru.rrtyui.moneytracker.services.usecase.model.TransactionResult

interface TransactionCreateUseCase {
    fun invoke(command: TransactionCreateCommand): TransactionResult
}