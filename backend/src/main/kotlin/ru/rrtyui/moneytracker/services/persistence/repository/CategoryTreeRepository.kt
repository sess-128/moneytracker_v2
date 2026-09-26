package ru.rrtyui.moneytracker.services.persistence.repository

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.entity.CategoryTreeEntity
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeCreateRow
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeDeleteRow
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeUpdateRow

interface CategoryTreeRepository {
    fun existByParentId(id: UUID): Boolean

    fun existByUserIdAndCategoryId(userId: UUID, categoryId: UUID): Boolean

    fun existSubCategoryByUserIdAndCategoryId(userId: UUID, categoryId: UUID): Boolean

    fun createLink(categoryTreeCreateRow: CategoryTreeCreateRow): CategoryTreeEntity

    fun findAllByActorId(id: UUID): List<CategoryTreeEntity>

    fun update(updateRow: CategoryTreeUpdateRow): Int

    fun delete(deleteRow: CategoryTreeDeleteRow): Int
}