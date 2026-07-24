package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.CategoryCreateCommand
import ru.rrtyui.moneytracker.services.usecase.model.CategoryCreateResult

interface CategoryCreateUseCase {
    fun invoke(params: CategoryCreateCommand): CategoryCreateResult
}