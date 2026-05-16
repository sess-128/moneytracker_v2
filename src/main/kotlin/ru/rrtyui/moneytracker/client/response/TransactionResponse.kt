package ru.rrtyui.moneytracker.client.response

import com.fasterxml.jackson.annotation.JsonInclude
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@JsonInclude(JsonInclude.Include.NON_NULL)
data class TransactionResponse(
    @field:Schema(description = "Уникальный идентификатор транзакции", example = "123e4567-e89b-12d3-a456-426614174000")
    val id: UUID,

    @field:Schema(description = "ID категории, к которой относится транзакция", example = "123e4567-e89b-12d3-a456-426614174000")
    val categoryId: UUID,

    @field:Schema(description = "Сумма транзакции", example = "1500.50")
    val amount: BigDecimal,

    @field:Schema(description = "Описание или комментарий к транзакции", example = "Покупка в магазине")
    val description: String?,

    @field:Schema(description = "Дата и время совершения транзакции", example = "2023-10-25T14:30:00")
    val transactionDate: LocalDateTime?
)