package ru.rrtyui.moneytracker.client.response

import com.fasterxml.jackson.annotation.JsonInclude
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@JsonInclude(JsonInclude.Include.NON_NULL)
data class TransactionResponse(
    @field:Schema(description = "Уникальный идентификатор транзакции")
    val id: UUID,

    @field:Schema(description = "ID категории, к которой относится транзакция")
    val categoryId: UUID,

    @field:Schema(description = "Название категории")
    val categoryName: String,

    @field:Schema(description = "Тип категории")
    val type: CategoryTypeStatusResponse,

    @field:Schema(description = "Сумма транзакции")
    val amount: BigDecimal,

    @field:Schema(description = "Описание или комментарий к транзакции")
    val description: String?,

    @field:Schema(description = "Дата и время совершения транзакции")
    val transactionDate: LocalDateTime?
)