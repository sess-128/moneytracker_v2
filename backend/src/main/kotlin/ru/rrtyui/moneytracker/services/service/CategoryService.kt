package ru.rrtyui.moneytracker.services.service

import ru.rrtyui.moneytracker.services.service.model.CategoryCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryServiceModel

interface CategoryService {
    fun getAllCategories()

    fun create(createModel: CategoryCreateModel): CategoryServiceModel

    fun existByName(name: String): Boolean
}