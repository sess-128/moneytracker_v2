package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID

data class TransactionFilterRequest(
    @field:Schema(description = "Список ID конкретных категорий для фильтрации")
    val categoryIds: List<UUID> = emptyList(),

    @field:Schema(description = "Начальная дата периода фильтрации", example = "2023-10-01")
    val startDate: LocalDate = LocalDate.now(),

    @field:Schema(description = "Конечная дата периода фильтрации", example = "2023-10-31")
    val endDate: LocalDate? = null,

    @field:Schema(description = "Минимальная сумма транзакции", example = "100.00")
    val minAmount: BigDecimal = BigDecimal.ZERO,

    @field:Schema(description = "Максимальная сумма транзакции", example = "50000.00")
    val maxAmount: BigDecimal? = null,

    @field:Schema(description = "Тип транзакции (доход/расход). Если ничего не указано, то поиск по всем типам", example = "EXPENSE")
    val type: CategoryTypeStatusRequest = CategoryTypeStatusRequest.EXPENSE,

    @field:Schema(description = "Часть текста для поиска по описанию транзакции", example = "Пятерочка")
    val description: String? = null
)
