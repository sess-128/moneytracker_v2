package ru.rrtyui.moneytracker.services.usecase

import ru.rrtyui.moneytracker.services.usecase.model.FindCategoriesResult

interface FindCategoriesByUserUseCase {
    fun invoke(): List<FindCategoriesResult>
}