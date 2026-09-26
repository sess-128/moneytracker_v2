package ru.rrtyui.moneytracker.services.service

import java.util.UUID
import ru.rrtyui.moneytracker.services.service.model.CategoryCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryServiceModel

interface CategoryService {
    fun findByName(name: String): CategoryServiceModel?

    fun getById(id: UUID): CategoryServiceModel

    fun findAllByIds(categoriesIds: List<UUID>): List<CategoryServiceModel>

    fun create(createModel: CategoryCreateModel): CategoryServiceModel

    fun existByName(name: String): Boolean
}