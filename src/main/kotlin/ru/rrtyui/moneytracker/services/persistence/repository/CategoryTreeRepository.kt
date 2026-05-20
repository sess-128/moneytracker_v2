package ru.rrtyui.moneytracker.services.persistence.repository

import java.util.UUID
import org.jetbrains.exposed.v1.core.JoinType
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.isNull
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.client.request.CategoryAttachRequest
import ru.rrtyui.moneytracker.client.request.CategoryCreateRequest
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.services.persistence.tables.CategoriesTable
import ru.rrtyui.moneytracker.services.persistence.tables.CategoryTreeTable
import ru.rrtyui.moneytracker.services.exception.CategoryAlreadyExistsException
import ru.rrtyui.moneytracker.services.persistence.mapper.toCategoryDto

@Repository
class CategoryTreeRepository {

    fun attachChildToParent(
        attachDto: CategoryAttachRequest,
        userUuid: UUID
    ) =
        transaction {

            val parentId = CategoriesTable
                .selectAll()
                .where {
                    CategoriesTable.name eq attachDto.parentName
                }
                .limit(1)
                .firstOrNull()
                ?.get(CategoriesTable.id)
                ?: throw IllegalArgumentException(
                    "Parent category not found"
                )


            val childId = CategoriesTable
                .selectAll()
                .where {
                    CategoriesTable.name eq attachDto.childName
                }
                .limit(1)
                .firstOrNull()
                ?.get(CategoriesTable.id)
                ?: throw IllegalArgumentException(
                    "Child category not found"
                )

            if (parentId == childId) {
                throw IllegalArgumentException(
                    "Category cannot reference itself"
                )
            }


            val childAlreadyAttached = CategoryTreeTable
                .selectAll()
                .where {
                    (CategoryTreeTable.userId eq userUuid) and
                            (CategoryTreeTable.categoryId eq childId)
                }
                .any()

            if (childAlreadyAttached) {
                throw IllegalStateException(
                    "Child category already attached"
                )
            }


            val parentExistsInTree = CategoryTreeTable
                .selectAll()
                .where {
                    (CategoryTreeTable.userId eq userUuid) and
                            (CategoryTreeTable.categoryId eq parentId)
                }
                .any()

            if (!parentExistsInTree) {
                throw IllegalStateException(
                    "Parent category not attached to user tree"
                )
            }

            CategoryTreeTable.insert {
                it[CategoryTreeTable.userId] = userUuid
                it[CategoryTreeTable.categoryId] = childId
                it[CategoryTreeTable.parentId] = parentId
            }
        }

    fun insertCategory(
        categoryId: UUID,
        userUuid: UUID,
        categoryCreateRequest: CategoryCreateRequest,
    ): CategoryResponse =
        transaction {

            val isCategoryExist = CategoryTreeTable
                .selectAll()
                .where {
                    (CategoryTreeTable.userId eq userUuid) and
                            (CategoryTreeTable.categoryId eq categoryId)
                }
                .any()

            if (isCategoryExist) {
                throw CategoryAlreadyExistsException("Category ${categoryCreateRequest.name} already exists in user tree")
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

            CategoryTreeTable.insert {
                it[CategoryTreeTable.userId] = userUuid
                it[CategoryTreeTable.categoryId] = categoryId
                it[CategoryTreeTable.parentId] = categoryCreateRequest.parentId
            }

            CategoryResponse(
                id = categoryId,
                name = categoryCreateRequest.name,
                type = categoryCreateRequest.type,
                parentId = categoryCreateRequest.parentId
            )
        }

    fun findUserTree(userUuid: UUID): List<CategoryResponse> = transaction {
        CategoryTreeTable.join(
            CategoriesTable,
            JoinType.INNER,
            CategoryTreeTable.categoryId,
            CategoriesTable.id
        )
            .selectAll()
            .where {
                CategoryTreeTable.userId eq userUuid
            }
            .map { it.toCategoryDto() }
    }

    fun findChildren(
        parentId: UUID,
        userUuid: UUID
    ): List<CategoryResponse> =
        transaction {

            (CategoryTreeTable innerJoin CategoriesTable)
                .selectAll()
                .where {
                    (CategoryTreeTable.userId eq userUuid) and
                            (CategoryTreeTable.parentId eq parentId)
                }
                .map { it.toCategoryDto() }
        }

    fun findRoots(
        userUuid: UUID
    ): List<CategoryResponse> =
        transaction {

            (CategoryTreeTable innerJoin CategoriesTable)
                .selectAll()
                .where {
                    (CategoryTreeTable.userId eq userUuid) and
                            (CategoryTreeTable.parentId.isNull())
                }
                .map { it.toCategoryDto() }
        }

    fun deleteCategory(
        categoryId: UUID,
        userUuid: UUID
    ) = transaction {

        val hasChildren = CategoryTreeTable
            .selectAll()
            .where {
                (CategoryTreeTable.userId eq userUuid) and
                        (CategoryTreeTable.parentId eq categoryId)
            }
            .any()

        if (hasChildren) {
            throw IllegalStateException(
                "Cannot delete category with children"
            )
        }

        CategoryTreeTable.deleteWhere {
            (CategoryTreeTable.userId eq userUuid) and
                    (CategoryTreeTable.categoryId eq categoryId)
        }
    }

    fun isLeafCategory(
        categoryId: UUID,
        userUuid: UUID
    ): Boolean =
        transaction {

            CategoryTreeTable
                .selectAll()
                .where {
                    (CategoryTreeTable.userId eq userUuid) and
                            (CategoryTreeTable.parentId eq categoryId)
                }
                .empty()
        }
}