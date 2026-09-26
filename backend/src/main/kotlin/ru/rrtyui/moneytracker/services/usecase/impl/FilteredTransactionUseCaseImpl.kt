package ru.rrtyui.moneytracker.services.usecase.impl

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.usecase.FilteredTransactionUseCase
import ru.rrtyui.moneytracker.services.usecase.model.TransactionFilterParams
import ru.rrtyui.moneytracker.services.usecase.model.TransactionResult

@Service
class FilteredTransactionUseCaseImpl(
    private val transactionService: TransactionService,
    private val actorPrincipalService: ActorPrincipalService,
): FilteredTransactionUseCase {
    override fun invoke(params: TransactionFilterParams): List<TransactionResult> {
        val actorPrincipal = actorPrincipalService.getCurrentActor()
//        transactionService.filterTransaction()
            return emptyList()
    }
}