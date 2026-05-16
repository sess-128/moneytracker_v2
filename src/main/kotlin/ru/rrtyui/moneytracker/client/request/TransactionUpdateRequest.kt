package ru.rrtyui.moneytracker.client.request

import java.time.LocalDateTime
import java.util.UUID

data class TransactionUpdateRequest(
    val id: UUID,
    val transactionDate: LocalDateTime
)