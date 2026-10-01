package ru.rrtyui.moneytracker.services.usecase.impl

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.usecase.AnalyticsFilterUseCase
import ru.rrtyui.moneytracker.services.usecase.mapper.AnalyticsMapper.toResult
import ru.rrtyui.moneytracker.services.usecase.mapper.AnalyticsMapper.toServiceModel
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterParams
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsFilterResult

@Service
class AnalyticsFilterUseCaseImpl(
    private val transactionService: TransactionService,
    private val actorPrincipalService: ActorPrincipalService,
): AnalyticsFilterUseCase {
    override fun invoke(params: AnalyticsFilterParams): List<AnalyticsFilterResult> {
        val actorPrincipal = actorPrincipalService.getCurrentActor()

        val filterTransactionServiceModel = params.toServiceModel(actorPrincipal.id)

        val filterTransaction = transactionService.filterTransaction(filterTransactionServiceModel)
        return filterTransaction.map { it.toResult() }
    }
}