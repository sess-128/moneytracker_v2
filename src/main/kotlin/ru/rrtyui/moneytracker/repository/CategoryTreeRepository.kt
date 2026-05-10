package ru.rrtyui.moneytracker.repository

import org.jetbrains.exposed.v1.core.JoinType
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.isNull
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.api.dto.category.CategoryAttachDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryCreateDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryResponseDto
import ru.rrtyui.moneytracker.entity.Categories
import ru.rrtyui.moneytracker.entity.CategoryTree
import ru.rrtyui.moneytracker.exception.CategoryAlreadyExistsException
import ru.rrtyui.moneytracker.mapper.toCategoryDto
import java.util.*

@Repository
class CategoryTreeRepository {

    fun attachChildToParent(
        attachDto: CategoryAttachDto,
        userUuid: UUID
    ) =
        transaction {

            val parentId = Categories
                .selectAll()
                .where {
                    Categories.name eq attachDto.parentName
                }
                .limit(1)
                .firstOrNull()
                ?.get(Categories.id)
                ?: throw IllegalArgumentException(
                    "Parent category not found"
                )


            val childId = Categories
                .selectAll()
                .where {
                    Categories.name eq attachDto.childName
                }
                .limit(1)
                .firstOrNull()
                ?.get(Categories.id)
                ?: throw IllegalArgumentException(
                    "Child category not found"
                )

            if (parentId == childId) {
                throw IllegalArgumentException(
                    "Category cannot reference itself"
                )
            }


            val childAlreadyAttached = CategoryTree
                .selectAll()
                .where {
                    (CategoryTree.userId eq userUuid) and
                            (CategoryTree.categoryId eq childId)
                }
                .any()

            if (childAlreadyAttached) {
                throw IllegalStateException(
                    "Child category already attached"
                )
            }


            val parentExistsInTree = CategoryTree
                .selectAll()
                .where {
                    (CategoryTree.userId eq userUuid) and
                            (CategoryTree.categoryId eq parentId)
                }
                .any()

            if (!parentExistsInTree) {
                throw IllegalStateException(
                    "Parent category not attached to user tree"
                )
            }

            CategoryTree.insert {
                it[CategoryTree.userId] = userUuid
                it[CategoryTree.categoryId] = childId
                it[CategoryTree.parentId] = parentId
            }
        }

    fun insertCategory(
        categoryId: UUID,
        userUuid: UUID,
        categoryCreateDto: CategoryCreateDto,
    ): CategoryResponseDto =
        transaction {

            val isCategoryExist = CategoryTree
                .selectAll()
                .where {
                    (CategoryTree.userId eq userUuid) and
                            (CategoryTree.categoryId eq categoryId)
                }
                .any()

            if (isCategoryExist) {
                throw CategoryAlreadyExistsException("Category ${categoryCreateDto.name} already exists in user tree")
            }

//            if (categoryCreateDto.parentId != null) {
//                val isParentExist = CategoryTree
//                    .selectAll()
//                    .where {
//                        (CategoryTree.userId eq userUuid) and
//                                (CategoryTree.categoryId eq categoryCreateDto.parentId)
//                    }
//                    .any()
//
//                if (!isParentExist) {
//                    throw IllegalStateException("Parent category not found in user tree")
//                }
//            }

            CategoryTree.insert {
                it[CategoryTree.userId] = userUuid
                it[CategoryTree.categoryId] = categoryId
                it[CategoryTree.parentId] = categoryCreateDto.parentId
            }

            CategoryResponseDto(
                id = categoryId,
                name = categoryCreateDto.name,
                type = categoryCreateDto.type,
                parentId = categoryCreateDto.parentId
            )
        }

    fun findUserTree(userUuid: UUID): List<CategoryResponseDto> = transaction {
        CategoryTree.join(
            Categories,
            JoinType.INNER,
            CategoryTree.categoryId,
            Categories.id
        )
            .selectAll()
            .where {
                CategoryTree.userId eq userUuid
            }
            .map { it.toCategoryDto() }
    }

    fun findChildren(
        parentId: UUID,
        userUuid: UUID
    ): List<CategoryResponseDto> =
        transaction {

            (CategoryTree innerJoin Categories)
                .selectAll()
                .where {
                    (CategoryTree.userId eq userUuid) and
                            (CategoryTree.parentId eq parentId)
                }
                .map { it.toCategoryDto() }
        }

    fun findRoots(
        userUuid: UUID
    ): List<CategoryResponseDto> =
        transaction {

            (CategoryTree innerJoin Categories)
                .selectAll()
                .where {
                    (CategoryTree.userId eq userUuid) and
                            (CategoryTree.parentId.isNull())
                }
                .map { it.toCategoryDto() }
        }

    fun deleteCategory(
        categoryId: UUID,
        userUuid: UUID
    ) = transaction {

        val hasChildren = CategoryTree
            .selectAll()
            .where {
                (CategoryTree.userId eq userUuid) and
                        (CategoryTree.parentId eq categoryId)
            }
            .any()

        if (hasChildren) {
            throw IllegalStateException(
                "Cannot delete category with children"
            )
        }

        CategoryTree.deleteWhere {
            (CategoryTree.userId eq userUuid) and
                    (CategoryTree.categoryId eq categoryId)
        }
    }

    fun isLeafCategory(
        categoryId: UUID,
        userUuid: UUID
    ): Boolean =
        transaction {

            CategoryTree
                .selectAll()
                .where {
                    (CategoryTree.userId eq userUuid) and
                            (CategoryTree.parentId eq categoryId)
                }
                .empty()
        }
}