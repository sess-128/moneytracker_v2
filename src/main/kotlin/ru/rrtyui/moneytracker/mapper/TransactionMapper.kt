package ru.rrtyui.moneytracker.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionResponseDto
import ru.rrtyui.moneytracker.entity.Transactions

fun ResultRow.toTransactionDto() =
    TransactionResponseDto(
        id = this[Transactions.id].value,
        categoryId = this[Transactions.categoryId].value,
        amount = this[Transactions.amount],
        description = this[Transactions.description],
        transactionDate = this[Transactions.transactionDate],
    )
