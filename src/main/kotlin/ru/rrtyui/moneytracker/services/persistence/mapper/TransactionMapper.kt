package ru.rrtyui.moneytracker.services.persistence.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.services.persistence.tables.TransactionsTable

fun ResultRow.toTransactionDto() =
    TransactionResponse(
        id = this[TransactionsTable.id].value,
        categoryId = this[TransactionsTable.categoryId].value,
        amount = this[TransactionsTable.amount],
        description = this[TransactionsTable.description],
        transactionDate = this[TransactionsTable.transactionDate],
    )
