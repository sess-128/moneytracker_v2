package ru.rrtyui.moneytracker.services.usecase.mapper

import ru.rrtyui.moneytracker.services.service.model.CategoryTypeModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel
import ru.rrtyui.moneytracker.services.usecase.mapper.CategoryMapper.toUseCase
import ru.rrtyui.moneytracker.services.usecase.model.TransactionCreateResult

object TransactionMapper {
    fun TransactionServiceModel.toResult(categoryType: CategoryTypeModel) =
        TransactionCreateResult(
            id = this.id,
            categoryId = this.categoryId,
            type = categoryType.toUseCase(),
            amount = this.amount,
            description = this.description,
            transactionDate = this.transactionDate,
        )
}