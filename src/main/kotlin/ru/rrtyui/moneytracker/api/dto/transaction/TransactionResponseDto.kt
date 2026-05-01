package ru.rrtyui.moneytracker.api.dto.transaction

data class TransactionResponseDto(
    val transactionAmount : Double,
    val transactionDescription : String
)
