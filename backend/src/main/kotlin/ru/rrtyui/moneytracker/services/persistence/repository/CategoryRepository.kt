package ru.rrtyui.moneytracker.services.persistence.repository

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.entity.CategoryEntity
import ru.rrtyui.moneytracker.services.persistence.model.CategoryCreateRow

interface CategoryRepository {
    fun existByName(name: String): Boolean

    fun existById(id: UUID): Boolean

    fun create(categoryCreateRow: CategoryCreateRow): CategoryEntity

    fun getByName(name: String): CategoryEntity?

    fun findById(id: UUID): CategoryEntity?

    fun findByIds(ids: List<UUID>): List<CategoryEntity>

    /**
     * Технический метод
     */
    fun update()

    /**
     * Технический метод
     */
    fun delete()
}