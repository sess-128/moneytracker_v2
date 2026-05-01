package ru.rrtyui.moneytracker.api.dto.transaction

data class TransactionRequestDto(
    val transactionAmount : Double,
    val transactionDescription : String
)
