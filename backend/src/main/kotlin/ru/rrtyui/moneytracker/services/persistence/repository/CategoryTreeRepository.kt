package ru.rrtyui.moneytracker.services.persistence.repository

import java.util.UUID
import ru.rrtyui.moneytracker.services.persistence.entity.CategoryTreeEntity
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeCreateRow

interface CategoryTreeRepository {
    fun existById(id: UUID): Boolean

    fun createLink(categoryTreeCreateRow: CategoryTreeCreateRow): CategoryTreeEntity

    fun findAllByActorId(id: UUID): List<CategoryTreeEntity>

    fun update()

    /**
     * Технический метод
     */
    fun delete()
}