package ru.rrtyui.moneytracker.api.dto.transaction

import java.time.LocalDateTime
import java.util.UUID

data class TransactionUpdateRequestDto(
    val id: UUID,
    val createdAt: LocalDateTime
)