package ru.rrtyui.moneytracker.services.usecase.impl

import java.math.BigDecimal
import java.math.RoundingMode
import java.util.UUID
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.client.response.AnalyticsTypedSummaryResponse
import ru.rrtyui.moneytracker.client.response.TransactionGroup
import ru.rrtyui.moneytracker.client.response.TransactionItem
import ru.rrtyui.moneytracker.client.response.TypedSummary
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.CategoryService // <-- Импорт
import ru.rrtyui.moneytracker.services.service.CategoryTreeService
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.service.model.FilterTransactionServiceModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel
import ru.rrtyui.moneytracker.services.usecase.AnalyticsTypedSummaryUseCase
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsTypedSummaryParams

@Service
class AnalyticsTypedSummaryUseCaseImpl(
    private val actorPrincipalService: ActorPrincipalService,
    private val transactionService: TransactionService,
    private val categoryTreeService: CategoryTreeService,
    private val categoryService: CategoryService,
) : AnalyticsTypedSummaryUseCase {

    override fun invoke(params: AnalyticsTypedSummaryParams): AnalyticsTypedSummaryResponse {
        val actorId = actorPrincipalService.getCurrentActor().id

        val filter = FilterTransactionServiceModel(
            categoryIds = params.categoryIds,
            startDate = params.startDate,
            endDate = params.endDate,
            minAmount = params.minAmount,
            maxAmount = params.maxAmount,
            actorId = actorId,
        )

        val transactions = transactionService.filterTransaction(filter)

        if (transactions.isEmpty()) {
            return AnalyticsTypedSummaryResponse(
                summary = emptySummary(),
                transactions = emptyList()
            )
        }

        val totalSum = transactions.sumOf { it.amount }
        val links = categoryTreeService.findAllLinksByActorId(actorId)

        val parentByCategory = links.associate { it.categoryId to it.parentId }
        val childrenByParent = links
            .filter { it.parentId != null }
            .groupBy({ it.parentId!! }, { it.categoryId })

        val transactionsByCategory = transactions.groupBy { it.categoryId }

        // 1. Собираем все активные ID (те, что имеют транзакции, и их предков до корня)
        val activeCategoryIds = mutableSetOf<UUID>()
        fun addPathToRoot(categoryId: UUID) {
            var currentId: UUID? = categoryId
            while (currentId != null) {
                if (!activeCategoryIds.add(currentId)) break
                currentId = parentByCategory[currentId]
            }
        }
        transactions.forEach { addPathToRoot(it.categoryId) }

        // 2. Запрашиваем имена ВСЕХ активных категорий (включая пустые родительские "папки")
        val allCategories = categoryService.findAllByIds(activeCategoryIds.toList())
        val categoryNamesMap = allCategories.associate { it.id to it.name }

        // Рекурсивный сбор транзакций поддерева
        fun collectSubtreeTransactions(groupId: UUID): List<TransactionServiceModel> {
            val current = transactionsByCategory[groupId].orEmpty()
            val children = childrenByParent[groupId].orEmpty()
            return current + children.flatMap { collectSubtreeTransactions(it) }
        }

        fun buildGroup(categoryId: UUID, path: Set<UUID> = emptySet()): TransactionGroup? {
            if (categoryId in path) return null

            val allSubtreeTransactions = collectSubtreeTransactions(categoryId)

            // Если в поддереве нет транзакций, пропускаем узел
            if (allSubtreeTransactions.isEmpty()) return null

            // Берем имя из мапы всех категорий. Если вдруг категории нет в базе (редкий кейс), используем ID
            val categoryName = categoryNamesMap[categoryId] ?: categoryId.toString()

            val childIds = childrenByParent[categoryId].orEmpty()
            val childGroups = childIds.mapNotNull { childId ->
                buildGroup(childId, path + categoryId)
            }

            val summary = allSubtreeTransactions.toTypedSummary(totalSum)

            // Items только для текущей категории
            val currentCategoryTransactions = transactionsByCategory[categoryId].orEmpty()
            val items = currentCategoryTransactions.map { it.toItem() }

            return TransactionGroup(
                categoryId = categoryId,
                categoryName = categoryName,
                summary = summary,
                items = items,
                childCategories = childGroups,
            )
        }

        val rootIds = activeCategoryIds.filter { parentByCategory[it] == null }
        val groups = rootIds.mapNotNull { buildGroup(it) }

        return AnalyticsTypedSummaryResponse(
            summary = transactions.toTypedSummary(totalSum),
            transactions = groups,
        )
    }

    private fun TransactionServiceModel.toItem() = TransactionItem(
        id = id,
        categoryId = categoryId,
        categoryName = categoryName,
        amount = amount,
        description = description,
        transactionDate = transactionDate,
    )

    private fun List<TransactionServiceModel>.toTypedSummary(totalSum: BigDecimal): TypedSummary {
        if (isEmpty()) return emptySummary()
        val sum = sumOf { it.amount }
        val maxForMonth = groupBy { it.transactionDate.year to it.transactionDate.month }
            .values
            .maxOfOrNull { monthTransactions -> monthTransactions.sumOf { it.amount } }
            ?: BigDecimal.ZERO

        val percentage = if (totalSum.compareTo(BigDecimal.ZERO) == 0) {
            0f
        } else {
            sum.multiply(BigDecimal(100))
                .divide(totalSum, 2, RoundingMode.HALF_UP)
                .toFloat()
        }

        val average = sum.divide(BigDecimal(size), 2, RoundingMode.HALF_UP)

        return TypedSummary(
            sum = sum,
            percentage = percentage,
            maxForMonth = maxForMonth,
            average = average,
        )
    }

    private fun emptySummary() = TypedSummary(
        sum = BigDecimal.ZERO,
        percentage = 0f,
        maxForMonth = BigDecimal.ZERO,
        average = BigDecimal.ZERO,
    )
}