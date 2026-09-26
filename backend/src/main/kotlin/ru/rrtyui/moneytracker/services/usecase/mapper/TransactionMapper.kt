package ru.rrtyui.moneytracker.services.usecase.mapper

import ru.rrtyui.moneytracker.services.service.model.CategoryTypeModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel
import ru.rrtyui.moneytracker.services.usecase.mapper.CategoryMapper.toUseCase
import ru.rrtyui.moneytracker.services.usecase.model.TransactionResult

object TransactionMapper {
    fun TransactionServiceModel.toUseCase(categoryType: CategoryTypeModel) =
        TransactionResult(
            id = this.id,
            categoryId = this.categoryId,
            categoryName = this.categoryName,
            type = categoryType.toUseCase(),
            amount = this.amount,
            description = this.description,
            transactionDate = this.transactionDate,
        )
} 