package ru.rrtyui.moneytracker.services.service.model

data class TransactionPageServiceModel(
    val items: List<TransactionServiceModel>,
    val nextCursor: String?
)
