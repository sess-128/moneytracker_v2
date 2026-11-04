package ru.rrtyui.moneytracker.services.usecase.impl

import java.util.UUID
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.client.response.AnalyticsSummaryResponse
import ru.rrtyui.moneytracker.client.response.MonthSummary
import ru.rrtyui.moneytracker.client.response.Summary
import ru.rrtyui.moneytracker.client.response.YearSummary
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.CategoryTreeService
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.service.model.CategoryServiceModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTypeModel
import ru.rrtyui.moneytracker.services.service.model.FilterTransactionServiceModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel
import ru.rrtyui.moneytracker.services.usecase.AnalyticsSummaryUseCase
import ru.rrtyui.moneytracker.services.usecase.model.AnalyticsSummaryParams

@Service
class AnalyticsSummaryUseCaseImpl(
    private val actorPrincipalService: ActorPrincipalService,
    private val transactionService: TransactionService,
    private val categoryService: CategoryService,
    private val categoryTreeService: CategoryTreeService,
) : AnalyticsSummaryUseCase {
    override fun invoke(params: AnalyticsSummaryParams): AnalyticsSummaryResponse {
        val actorPrincipal = actorPrincipalService.getCurrentActor()

        val filterTransactionServiceModel = FilterTransactionServiceModel(
            startDate = params.startDate,
            endDate = params.endDate,
            actorId = actorPrincipal.id,
        )

        val transactions = transactionService.filterTransaction(filterTransactionServiceModel)

        // Получаем мапу категорий для быстрого доступа по ID
        val categoryIds = transactions.map { it.categoryId }.distinct()
        val categoriesMap = categoryService.findAllByIds(categoryIds).associateBy { it.id }

        // Группируем транзакции по году
        val byYear = transactions.groupBy { it.transactionDate.year }

        val years = byYear.map { (year, yearTransactions) ->
            // Внутри года группируем по месяцу
            val byMonth = yearTransactions.groupBy { it.transactionDate.monthValue }

            val months = byMonth.map { (month, monthTransactions) ->
                MonthSummary(
                    month = month,
                    summary = monthTransactions.toSummary(categoriesMap)
                )
            }.sortedBy { it.month }

            YearSummary(
                year = year,
                months = months,
                summary = yearTransactions.toSummary(categoriesMap)
            )
        }.sortedBy { it.year }

        return AnalyticsSummaryResponse(years = years)
    }

    private fun List<TransactionServiceModel>.toSummary(categories: Map<UUID, CategoryServiceModel>): Summary {
        val income = this.filter {
            categories[it.categoryId]?.type == CategoryTypeModel.INCOME
        }.sumOf { it.amount }

        val expense = this.filter {
            categories[it.categoryId]?.type == CategoryTypeModel.EXPENSE
        }.sumOf { it.amount }

        val savings = this.filter {
            categories[it.categoryId]?.type == CategoryTypeModel.SAVINGS
        }.sumOf { it.amount }

        // Баланс = Доходы - Расходы - Накопления
        val balance = income - expense - savings

        return Summary(
            income = income,
            expense = expense,
            savings = savings,
            balance = balance
        )
    }
}