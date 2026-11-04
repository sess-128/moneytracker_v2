package ru.rrtyui.moneytracker.services.usecase.impl

import java.time.LocalDateTime
import java.util.Base64
import java.util.UUID
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.service.model.TransactionCursor
import ru.rrtyui.moneytracker.services.usecase.FindTransactionsPageByUserUseCase
import ru.rrtyui.moneytracker.services.usecase.mapper.TransactionMapper.toUseCase
import ru.rrtyui.moneytracker.services.usecase.model.TransactionPageResult

@Service
class FindTransactionsPageByUserUseCaseImpl(
    private val categoryService: CategoryService,
    private val actorPrincipalService: ActorPrincipalService,
    private val transactionService: TransactionService,
): FindTransactionsPageByUserUseCase {

    override fun invoke(cursor: String?): TransactionPageResult {
        val actorPrincipal = actorPrincipalService.getCurrentActor()

        val transactionCursor = cursor?.let {
            val decoded = String(Base64.getUrlDecoder().decode(it))
            val parts = decoded.split("|")

            TransactionCursor(
                transactionDate = LocalDateTime.parse(parts[0]),
                id = UUID.fromString(parts[1])
            )
        }

        val page = transactionService.findPageByUserId(actorPrincipal.id, transactionCursor)

        val categoriesIds = page.items.map { it.categoryId }
        val categoryTypeMap = categoryService.findAllByIds(categoriesIds)
            .associate { it.id to it.type }

        val transactions = page.items.map { transaction ->
            transaction.toUseCase(categoryTypeMap.getValue(transaction.categoryId))
        }

        return TransactionPageResult(
            items = transactions,
            nextCursor = page.nextCursor
        )
    }
}