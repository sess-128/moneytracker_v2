package ru.rrtyui.moneytracker.services.service.model

import java.time.LocalDateTime
import java.util.UUID

data class TransactionCursor(
    val transactionDate: LocalDateTime,
    val id: UUID
)
