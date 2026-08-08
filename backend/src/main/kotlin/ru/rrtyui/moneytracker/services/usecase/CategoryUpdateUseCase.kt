package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.CategoryUpdateCommand

interface CategoryUpdateUseCase {
    fun invoke(command: CategoryUpdateCommand)
}