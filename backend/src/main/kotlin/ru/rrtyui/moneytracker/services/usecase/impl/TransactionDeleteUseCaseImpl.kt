package ru.rrtyui.moneytracker.services.usecase.impl

import java.util.UUID
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.usecase.TransactionDeleteUseCase

@Service
class TransactionDeleteUseCaseImpl(
    private val transactionService: TransactionService
): TransactionDeleteUseCase {
    override fun invoke(transactionId: UUID) {
        transactionService.deleteById(transactionId)
    }
}