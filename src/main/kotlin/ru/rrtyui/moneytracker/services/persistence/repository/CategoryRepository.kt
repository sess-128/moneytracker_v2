package ru.rrtyui.moneytracker.services.persistence.repository

import java.util.UUID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.datetime.CurrentDateTime
import org.jetbrains.exposed.v1.jdbc.insertAndGetId
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.client.request.CategoryCreateRequest
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.client.request.CategoryUpdateRequest
import ru.rrtyui.moneytracker.services.persistence.tables.CategoriesTable


@Repository
class CategoryRepository {

    fun findOrCreateCategory(categoryCreate: CategoryCreateRequest): UUID =
        transaction {

            CategoriesTable
                .selectAll()
                .where { CategoriesTable.name eq categoryCreate.name }
                .map { it[CategoriesTable.id].value }
                .singleOrNull()
                ?: CategoriesTable.insertAndGetId {
                    it[name] = categoryCreate.name
                    it[type] = categoryCreate.type
                }.value
        }

    fun updateCategory(categoryUpdate: CategoryUpdateRequest): CategoryResponse =
        transaction {
            val row = CategoriesTable
                .selectAll()
                .where { CategoriesTable.name eq categoryUpdate.name }
                .firstOrNull()
                ?: throw IllegalArgumentException("Категория не найдена")

            val categoryId = row[CategoriesTable.id].value

            CategoriesTable.update({ CategoriesTable.id eq categoryId }) {
                it[name] = categoryUpdate.name
                it[updatedAt] = CurrentDateTime
            }

            CategoryResponse(
                categoryId,
                categoryUpdate.name,
                row[CategoriesTable.type],
                null // TODO MT-26
            )
        }
//
//    fun deleteCategory(dto: CategoryUpdateDto, userUuid: UUID) =
//        transaction {
//
//            val categoryId = Categories
//                .selectAll()
//                .where { Categories.name eq dto.name }
//                .limit(1)
//                .firstOrNull()
//                ?.get(Categories.id)?.value
//                ?: throw IllegalArgumentException("Категория не найдена")
//        }
}