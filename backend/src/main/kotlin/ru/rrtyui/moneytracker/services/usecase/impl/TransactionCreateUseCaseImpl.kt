package ru.rrtyui.moneytracker.services.usecase.impl

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.CategoryTreeService
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.usecase.TransactionCreateUseCase
import ru.rrtyui.moneytracker.services.usecase.mapper.TransactionMapper.toResult
import ru.rrtyui.moneytracker.services.usecase.model.TransactionCreateCommand
import ru.rrtyui.moneytracker.services.usecase.model.TransactionCreateResult

@Service
class TransactionCreateUseCaseImpl(
    private val actorPrincipalService: ActorPrincipalService,
    private val categoryTreeService: CategoryTreeService,
    private val categoryService: CategoryService,
    private val transactionService: TransactionService,
): TransactionCreateUseCase {
    override fun invoke(command: TransactionCreateCommand): TransactionCreateResult {
        /**
         * Перед созданием транзакции
         * - проверяем что это категория пользователя
         * - получаем категорию для определения типа транзакции? ХЗ нужно ли это вообще и можно просто отражать
         * транзакции без типа. Это лишний запрос к категориям, но все же
         * - у категории берем тип
         * - создаем транзакцию
         *
         * Проверку на то, что эта категория самая дочерняя, то есть у нее нет дочерних
         */
        val actorPrincipal = actorPrincipalService.getCurrentActor()
        categoryTreeService.checkIsLastSubCategory(actorPrincipal.id, command.categoryId)

        val category = categoryService.getById(command.categoryId)

        val createModel = TransactionCreateModel(
            categoryId = command.categoryId,
            transactionDateTime = command.transactionDate,
            amount = command.amount,
            description = command.description,
            actorId = actorPrincipal.id,
            actorName = actorPrincipal.username,
        )
        val createdTransaction = transactionService.create(createModel)

        return createdTransaction.toResult(category.type)
    }
}