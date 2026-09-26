package ru.rrtyui.moneytracker.services.service.mapper

import ru.rrtyui.moneytracker.services.persistence.model.CategoryCreateRow
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeCreateRow
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeDeleteRow
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeUpdateRow
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryTableType
import ru.rrtyui.moneytracker.services.service.model.CategoryCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeUpdateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTypeModel

object CategoryServiceMapper {
    fun CategoryCreateModel.toCategoryCreateRow() =
        CategoryCreateRow(
            name = this.name,
            type = this.type.toPersist(),
            actorId = this.actorId,
            actorName = this.actorName,
        )

    fun CategoryTypeModel.toPersist(): CategoryTableType =
        when(this) {
            CategoryTypeModel.EXPENSE -> CategoryTableType.EXPENSE
            CategoryTypeModel.INCOME -> CategoryTableType.INCOME
            CategoryTypeModel.SAVINGS -> CategoryTableType.SAVINGS
        }

    fun CategoryTreeCreateModel.toCreateRow() =
        CategoryTreeCreateRow(
            categoryId = this.categoryId,
            parentId = this.parentId,
            actorId = this.actorId,
        )

    fun CategoryTreeUpdateModel.toUpdateRow() =
        CategoryTreeUpdateRow(
            oldCategoryId = this.oldCategoryId,
            newCategoryId = this.newCategoryId,
            actorId = this.actorId,
        )

    fun CategoryTreeUpdateModel.toDeleteRow() =
        CategoryTreeDeleteRow(
            categoryId = this.oldCategoryId,
            actorId = this.actorId
        )
}