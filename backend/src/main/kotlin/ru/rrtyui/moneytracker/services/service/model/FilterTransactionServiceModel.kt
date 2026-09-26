package ru.rrtyui.moneytracker.services.service.model

import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID
import ru.rrtyui.moneytracker.client.request.CategoryTypeStatusRequest

data class FilterTransactionServiceModel(
    val categoryIds: List<UUID>,
    val startDate: LocalDate,
    val endDate: LocalDate? = null,
    val minAmount: BigDecimal,
    val maxAmount: BigDecimal? = null,
    val type: CategoryTypeStatusRequest,
    val description: String? = null,
    val actorId: UUID,
    )