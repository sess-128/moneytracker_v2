package ru.rrtyui.moneytracker.services.persistence.repository

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.entity.TransactionEntity
import ru.rrtyui.moneytracker.services.persistence.model.TransactionCreateRow
import ru.rrtyui.moneytracker.services.persistence.model.TransactionReplaceCategoryRow
import ru.rrtyui.moneytracker.services.usecase.model.TransactionFilterParams

interface TransactionRepository {
    fun create(createRow: TransactionCreateRow): TransactionEntity

    fun findAll(userId: UUID): List<TransactionEntity>

    fun replaceCategory(replaceRow: TransactionReplaceCategoryRow)

    fun findFiltered(filterParams: TransactionFilterParams)
}