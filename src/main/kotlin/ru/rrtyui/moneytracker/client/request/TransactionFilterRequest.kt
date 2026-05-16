package ru.rrtyui.moneytracker.client.request

import java.math.BigDecimal
import java.time.LocalDate
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryType

data class TransactionFilterRequest(
    val startDate: LocalDate,
    val endDate: LocalDate,
    val parentCategoryIds: MutableList<Long>,
    val categoryIds: MutableList<Long>,
    val minAmount: BigDecimal,
    val maxAmount: BigDecimal,
    val description: String,
    val type: CategoryType? = null
)
