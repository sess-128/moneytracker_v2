package ru.rrtyui.moneytracker.services.persistence.mapper

import ru.rrtyui.moneytracker.services.persistence.entity.CategoryEntity
import ru.rrtyui.moneytracker.services.persistence.entity.CategoryTreeEntity
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryTableType
import ru.rrtyui.moneytracker.services.service.model.CategoryServiceModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeServiceModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTypeModel

fun CategoryEntity.toServiceModel() =
    CategoryServiceModel(
        id = this.id.value,
        name = this.name,
        type = this.type.toServiceModel(),
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    )

fun CategoryTableType.toServiceModel(): CategoryTypeModel =
    when(this) {
        CategoryTableType.EXPENSE -> CategoryTypeModel.EXPENSE
        CategoryTableType.INCOME -> CategoryTypeModel.INCOME
        CategoryTableType.SAVINGS -> CategoryTypeModel.SAVINGS
    }

fun CategoryTreeEntity.toServiceModel() =
    CategoryTreeServiceModel(
        id = this.id.value,
        categoryId = this.categoryId,
        parentId = this.parentId,
    )
