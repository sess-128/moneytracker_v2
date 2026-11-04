package ru.rrtyui.moneytracker.client.response

import io.swagger.v3.oas.annotations.media.Schema

data class TransactionPageResponse(
    @field:Schema(description = "Список транзакций пользователя")
    val items: List<TransactionResponse>,
    @field:Schema(description = "Идентификатор следующей транзакции")
    val nextCursor: String?
)
