package ru.rrtyui.moneytracker.services.persistence.repository.impl

import java.util.UUID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.inList
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.services.persistence.entity.CategoryEntity
import ru.rrtyui.moneytracker.services.persistence.model.CategoryCreateRow
import ru.rrtyui.moneytracker.services.persistence.repository.CategoryRepository
import ru.rrtyui.moneytracker.services.persistence.tables.CategoriesTable

@Repository
class CategoryRepositoryImpl: CategoryRepository { //TODO обернуть все в транзакшионал
    override fun existByName(name: String): Boolean {
        val predicate = (CategoriesTable.name eq name)

        return CategoryEntity
            .find { predicate }
            .empty()
            .not()
    }

    override fun existById(id: UUID): Boolean {
        val predicate = (CategoriesTable.id eq id)

        return CategoryEntity
            .find { predicate }
            .empty()
            .not()
    }

    override fun create(categoryCreateRow: CategoryCreateRow): CategoryEntity {
        return CategoryEntity.new {
            name = categoryCreateRow.name
            type = categoryCreateRow.type
        }
    }

    override fun findByName(name: String): CategoryEntity? {
        val predicate = (CategoriesTable.name eq name)

        return CategoryEntity
            .find { predicate }
            .firstOrNull()
    }

    override fun findById(id: UUID): CategoryEntity? {
        val predicate = (CategoriesTable.id eq id)

        return CategoryEntity
            .find { predicate }
            .singleOrNull()
    }

    override fun findByIds(ids: List<UUID>): List<CategoryEntity> {
        val predicate = (CategoriesTable.id inList ids)

        return CategoryEntity
            .find { predicate }
            .toList()
    }

    override fun update() {
        TODO("Not yet implemented")
    }

    override fun delete() {
        TODO("Not yet implemented")
    }

}