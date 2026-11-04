package ru.rrtyui.moneytracker.services.usecase.model

data class TransactionPageResult(
    val items: List<TransactionResult>,
    val nextCursor: String?
)
