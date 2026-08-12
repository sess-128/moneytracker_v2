package ru.rrtyui.moneytracker.services.service.mapper

import ru.rrtyui.moneytracker.services.persistence.entity.TransactionEntity
import ru.rrtyui.moneytracker.services.persistence.model.TransactionCreateRow
import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel

object TransactionServiceMapper {
    fun TransactionCreateModel.toCreateRow() =
        TransactionCreateRow(
            categoryId = this.categoryId,
            transactionDateTime = this.transactionDateTime!!, //TODO убрать !!
            amount = this.amount,
            description = this.description,
            actorId = this.actorId,
            actorName = this.actorName,
        )

    fun TransactionEntity.toServiceModel() =
        TransactionServiceModel(
            id = this.id.value,
            categoryId = this.categoryId,
            transactionDate = this.transactionDate,
            amount = this.amount,
            description = this.description,
            actorId = this.userId,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt,
        )
}