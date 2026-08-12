package ru.rrtyui.moneytracker.services.persistence.repository.impl

import java.util.UUID
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.services.persistence.entity.CategoryTreeEntity
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeCreateRow
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeDeleteRow
import ru.rrtyui.moneytracker.services.persistence.model.CategoryTreeUpdateRow
import ru.rrtyui.moneytracker.services.persistence.repository.CategoryTreeRepository
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryTreeTable

@Repository
class CategoryTreeRepositoryImpl: CategoryTreeRepository {
    override fun existByParentId(id: UUID): Boolean {
        val predicate = (CategoryTreeTable.parentId eq id)

        return CategoryTreeEntity
            .find { predicate }
            .empty()
            .not()
    }

    override fun existByUserIdAndCategoryId(userId: UUID, categoryId: UUID): Boolean {
        val predicate =
            (CategoryTreeTable.userId eq userId) and
                    (CategoryTreeTable.categoryId eq categoryId)

        return CategoryTreeEntity
            .find { predicate }
            .count() > 0
    }

    override fun existSubCategoryByUserIdAndCategoryId(
        userId: UUID,
        categoryId: UUID
    ): Boolean {
        val predicate =
            (CategoryTreeTable.userId eq userId) and
                    (CategoryTreeTable.parentId eq categoryId)

        return CategoryTreeEntity
            .find { predicate }
            .count() > 0
    }

    override fun createLink(categoryTreeCreateRow: CategoryTreeCreateRow): CategoryTreeEntity {
        return CategoryTreeEntity.new {
            categoryId = categoryTreeCreateRow.categoryId
            parentId = categoryTreeCreateRow.parentId
        }
    }

    override fun findAllByActorId(id: UUID): List<CategoryTreeEntity> {
        return CategoryTreeEntity
            .find { CategoryTreeTable.userId eq id }
            .toList()
    }

    override fun update(updateRow: CategoryTreeUpdateRow): Int {
        val predicateRoot =
            (CategoryTreeTable.userId eq updateRow.actorId) and
                    (CategoryTreeTable.parentId eq updateRow.oldCategoryId)

        val predicateChild =
            (CategoryTreeTable.userId eq updateRow.actorId) and
                    (CategoryTreeTable.categoryId eq updateRow.oldCategoryId)

        val updateRootCount = CategoryTreeTable.update(
            where = { predicateRoot },
            body = { row ->
                row[CategoryTreeTable.parentId] = updateRow.newCategoryId
            }
        )

        val updateCount = CategoryTreeTable.update(
            where = { predicateChild },
            body = { row ->
                row[CategoryTreeTable.categoryId] = updateRow.newCategoryId
            }
        )
        return updateCount + updateRootCount
    }

    override fun delete(deleteRow: CategoryTreeDeleteRow): Int {
        TODO("Not yet implemented")
    }
}