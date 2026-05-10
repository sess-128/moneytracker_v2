package ru.rrtyui.moneytracker.api.dto.transaction

import java.math.BigDecimal
import java.time.LocalDate
import ru.rrtyui.moneytracker.entity.CategoryType

data class TransactionRequestFilterDto(
    val startDate: LocalDate,
    val endDate: LocalDate,
    val parentCategoryIds: MutableList<Long>,
    val categoryIds: MutableList<Long>,
    val minAmount: BigDecimal,
    val maxAmount: BigDecimal,
    val description: String,
    val type: CategoryType? = null
)
