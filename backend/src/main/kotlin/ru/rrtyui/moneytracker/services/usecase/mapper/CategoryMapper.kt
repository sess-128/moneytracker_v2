package ru.rrtyui.moneytracker.services.usecase.mapper

import ru.rrtyui.moneytracker.services.service.model.ActorPrincipal
import ru.rrtyui.moneytracker.services.service.model.CategoryCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTypeModel
import ru.rrtyui.moneytracker.services.usecase.model.CategoryCreateCommand
import ru.rrtyui.moneytracker.services.usecase.model.CategoryTypeCommand

object CategoryMapper {
    fun CategoryCreateCommand.toServiceModel(actorPrincipal: ActorPrincipal) =
        CategoryCreateModel(
            name = this.name,
            type = this.type.toServiceModel(),
            actorId = actorPrincipal.id,
            actorName = actorPrincipal.username,
        )

    fun CategoryTypeCommand.toServiceModel(): CategoryTypeModel =
        when(this) {
            CategoryTypeCommand.EXPENSE -> CategoryTypeModel.EXPENSE
            CategoryTypeCommand.INCOME -> CategoryTypeModel.INCOME
            CategoryTypeCommand.SAVINGS -> CategoryTypeModel.SAVINGS
        }

    fun CategoryTypeModel.toUseCase(): CategoryTypeCommand =
        when(this) {
            CategoryTypeModel.EXPENSE -> CategoryTypeCommand.EXPENSE
            CategoryTypeModel.INCOME -> CategoryTypeCommand.INCOME
            CategoryTypeModel.SAVINGS -> CategoryTypeCommand.SAVINGS
        }
}