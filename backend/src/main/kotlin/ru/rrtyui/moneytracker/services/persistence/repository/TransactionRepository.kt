package ru.rrtyui.moneytracker.services.persistence.repository

import ru.rrtyui.moneytracker.services.persistence.entity.TransactionEntity
import ru.rrtyui.moneytracker.services.persistence.model.TransactionCreateRow

interface TransactionRepository {
    fun createTransaction(createRow: TransactionCreateRow): TransactionEntity
}