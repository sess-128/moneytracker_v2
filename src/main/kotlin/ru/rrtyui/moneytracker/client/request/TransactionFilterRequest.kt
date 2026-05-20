package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryType

data class TransactionFilterRequest(
    @field:Schema(description = "Начальная дата периода фильтрации", example = "2023-10-01")
    val startDate: LocalDate,

    @field:Schema(description = "Конечная дата периода фильтрации", example = "2023-10-31")
    val endDate: LocalDate,

    @field:Schema(description = "Список ID родительских категорий для фильтрации")
    val parentCategoryIds: MutableList<UUID> = mutableListOf(),

    @field:Schema(description = "Список ID конкретных категорий для фильтрации")
    val categoryIds: MutableList<UUID> = mutableListOf(),

    @field:Schema(description = "Минимальная сумма транзакции", example = "100.00")
    val minAmount: BigDecimal = BigDecimal.ZERO,

    @field:Schema(description = "Максимальная сумма транзакции", example = "50000.00")
    val maxAmount: BigDecimal = BigDecimal.valueOf(1000000),

    @field:Schema(description = "Часть текста для поиска по описанию транзакции", example = "Пятерочка")
    val description: String = "",

    @field:Schema(description = "Тип транзакции (доход/расход). Если ничего не указано, то поиск по всем типам", example = "EXPENSE")
    val type: CategoryType? = null
)
