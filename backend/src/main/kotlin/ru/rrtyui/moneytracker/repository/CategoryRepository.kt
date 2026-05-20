package ru.rrtyui.moneytracker.repository

import java.util.UUID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.datetime.CurrentDateTime
import org.jetbrains.exposed.v1.jdbc.insertAndGetId
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.api.dto.category.CategoryCreateDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryResponseDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryUpdateDto
import ru.rrtyui.moneytracker.entity.Categories


@Repository
class CategoryRepository {

    fun findOrCreateCategory(categoryCreate: CategoryCreateDto): UUID =
        transaction {

            Categories
                .selectAll()
                .where { Categories.name eq categoryCreate.name }
                .map { it[Categories.id].value }
                .singleOrNull()
                ?: Categories.insertAndGetId {
                    it[name] = categoryCreate.name
                    it[type] = categoryCreate.type
                }.value
        }

    fun updateCategory(categoryUpdate: CategoryUpdateDto): CategoryResponseDto =
        transaction {
            val row = Categories
                .selectAll()
                .where { Categories.name eq categoryUpdate.name }
                .firstOrNull()
                ?: throw IllegalArgumentException("Категория не найдена")

            val categoryId = row[Categories.id].value

            Categories.update({ Categories.id eq categoryId }) {
                it[name] = categoryUpdate.name
                it[updatedAt] = CurrentDateTime
            }

            CategoryResponseDto(
                categoryId,
                categoryUpdate.name,
                row[Categories.type],
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