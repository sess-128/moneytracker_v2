package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID


data class TransactionCreateRequest(
    @field:Schema(description = "ID категории транзакции", example = "123e4567-e89b-12d3-a456-426614174000")
    val categoryId: UUID,

    @field:Schema(description = "Сумма транзакции", example = "1500.50")
    val amount: BigDecimal,

    @field:Schema(description = "Описание или комментарий к транзакции", example = "Покупка в Пятерочке")
    val description: String?,

    @field:Schema(description = "Дата и время транзакции. Если не указано, используется текущее время", example = "2023-10-25T14:30:00")
    val transactionDate: LocalDateTime?
)
