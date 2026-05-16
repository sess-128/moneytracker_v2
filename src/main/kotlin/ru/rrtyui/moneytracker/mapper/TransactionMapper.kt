package ru.rrtyui.moneytracker.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.entity.Transactions

fun ResultRow.toTransactionDto() =
    TransactionResponse(
        id = this[Transactions.id].value,
        categoryId = this[Transactions.categoryId].value,
        amount = this[Transactions.amount],
        description = this[Transactions.description],
        transactionDate = this[Transactions.transactionDate],
    )
