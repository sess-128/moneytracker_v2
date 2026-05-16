package ru.rrtyui.moneytracker.client.request

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID


data class TransactionCreateRequest(
    val categoryId: UUID,
    val amount : BigDecimal,
    val description : String?,
    val transactionDate: LocalDateTime?
)
