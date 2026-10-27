package ru.rrtyui.moneytracker.services.service.impl

import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.AnalyticsService
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.service.model.AnalyticsFilterServiceModel
import ru.rrtyui.moneytracker.services.service.model.FilterTransactionServiceModel

@Service
class AnalyticsServiceImpl(
    private val transactionService: TransactionService
): AnalyticsService {
    override fun getAnalyticsByFilter(filterParams: FilterTransactionServiceModel): List<AnalyticsFilterServiceModel> {
        val transactions = transactionService.filterTransaction(filterParams)

        val endDate = filterParams.endDate ?: LocalDate.now()
        val daysInPeriod = ChronoUnit.DAYS.between(filterParams.startDate, endDate) + 1

        val result =
            transactions
                .groupBy { it.categoryName }
                .map { (categoryName, transactions) ->
                    val totalAmount = transactions.sumOf { it.amount }

                    val countOfTransactions = transactions.size

                    val avgInDay = totalAmount.divide(BigDecimal.valueOf(daysInPeriod), 4, RoundingMode.HALF_UP)

                    AnalyticsFilterServiceModel(
                        categoryName = categoryName,
                        amount = totalAmount.toString(),
                        countOfTransactions = countOfTransactions,
                        avgInDay = avgInDay
                    )
                }

        return result
    }
}