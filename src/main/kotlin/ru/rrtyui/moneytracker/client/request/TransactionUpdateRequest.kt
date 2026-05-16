package ru.rrtyui.moneytracker.client.request

import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime
import java.util.UUID

data class TransactionUpdateRequest(
    @field:Schema(description = "ID транзакции для обновления", example = "123e4567-e89b-12d3-a456-426614174000")
    val id: UUID,

    @field:Schema(description = "Новая дата и время транзакции", example = "2023-10-26T10:00:00")
    val transactionDate: LocalDateTime
)