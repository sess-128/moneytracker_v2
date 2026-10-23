package ru.rrtyui.moneytracker.services.usecase

import java.util.UUID

interface TransactionDeleteUseCase {
    fun invoke(transactionId: UUID)
}