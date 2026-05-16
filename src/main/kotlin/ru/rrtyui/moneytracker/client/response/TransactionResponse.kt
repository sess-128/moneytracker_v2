package ru.rrtyui.moneytracker.client.response

import com.fasterxml.jackson.annotation.JsonInclude
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@JsonInclude(JsonInclude.Include.NON_NULL)
data class TransactionResponse(
    val id: UUID,
    val categoryId: UUID,
    val amount : BigDecimal,
    val description : String?,
    val transactionDate: LocalDateTime?
)