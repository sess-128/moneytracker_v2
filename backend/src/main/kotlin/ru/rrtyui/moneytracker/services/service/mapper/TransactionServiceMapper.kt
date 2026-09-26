package ru.rrtyui.moneytracker.services.service.mapper

import ru.rrtyui.moneytracker.services.persistence.entity.TransactionEntity
import ru.rrtyui.moneytracker.services.persistence.model.TransactionCreateRow
import ru.rrtyui.moneytracker.services.persistence.model.TransactionReplaceCategoryRow
import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.service.model.TransactionReplaceCategoryModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel

object TransactionServiceMapper {
    fun TransactionCreateModel.toCreateRow() =
        TransactionCreateRow(
            categoryId = this.categoryId,
            categoryName = this.categoryName,
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
            categoryName = this.categoryName,
            transactionDate = this.transactionDate,
            amount = this.amount,
            description = this.description,
            actorId = this.userId,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt,
        )

    fun TransactionReplaceCategoryModel.toReplaceRow() =
        TransactionReplaceCategoryRow(
            oldCategoryId = this.oldCategoryId,
            newCategoryId = this.newCategoryId,
            actorId = this.actorId,
            newCategoryName = this.newCategoryName
        )
}