package ru.rrtyui.moneytracker.mapper

import kotlinx.datetime.toJavaLocalDateTime
import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionResponseDto
import ru.rrtyui.moneytracker.entity.Categories
import ru.rrtyui.moneytracker.entity.Transactions
import ru.rrtyui.moneytracker.entity.Users
import ru.rrtyui.moneytracker.service.data.TransactionData

fun ResultRow.toTransactional() = TransactionResponseDto (
    id = this[Transactions.id].value,
    categoryName = this[Categories.name],
    userName = this[Users.username],
    amount = this[Transactions.amount],
    description = this[Transactions.description],
    startDate = this[Transactions.createdAt].toJavaLocalDateTime().toLocalDate(),
    endDate = this[Transactions.updatedAt].toJavaLocalDateTime().toLocalDate(),
)



fun ResultRow.toTransactionalData() = TransactionData (
    id = this[Transactions.id].value,
    categoryName = this[Categories.name],
    userName = this[Users.username],
    amount = this[Transactions.amount],
    description = this[Transactions.description],
    startDate = this[Transactions.createdAt].date,
    endDate = this[Transactions.updatedAt].date
)
