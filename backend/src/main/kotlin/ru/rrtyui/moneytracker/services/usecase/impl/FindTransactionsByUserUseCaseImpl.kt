package ru.rrtyui.moneytracker.services.usecase.impl

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.usecase.FindTransactionsByUserUseCase
import ru.rrtyui.moneytracker.services.usecase.mapper.TransactionMapper.toUseCase
import ru.rrtyui.moneytracker.services.usecase.model.TransactionResult

@Service
class FindTransactionsByUserUseCaseImpl(
    private val categoryService: CategoryService,
    private val actorPrincipalService: ActorPrincipalService,
    private val transactionService: TransactionService,
): FindTransactionsByUserUseCase {
    override fun invoke(): List<TransactionResult> {
        val actorPrincipal = actorPrincipalService.getCurrentActor()

        val transactionServiceModels = transactionService.findAllByUserId(actorPrincipal.id)
        val categoriesIds = transactionServiceModels.map { it.categoryId }

        val categoryTypeMap = categoryService.findAllByIds(categoriesIds)
            .associate { it.id to it.type }

        val transactions = transactionServiceModels.map { transaction ->
            val categoryType = categoryTypeMap.getValue(transaction.categoryId)
            transaction.toUseCase(categoryType)
        }

        return transactions
    }
}