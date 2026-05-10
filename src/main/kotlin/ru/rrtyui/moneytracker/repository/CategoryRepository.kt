package ru.rrtyui.moneytracker.repository

import java.util.UUID
import org.jetbrains.exposed.v1.core.Op
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.datetime.CurrentDateTime
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.insertAndGetId
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.api.dto.category.CategoryCreateDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryResponseDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryUpdateDto
import ru.rrtyui.moneytracker.entity.Categories
import ru.rrtyui.moneytracker.entity.UserCategoryRel
import ru.rrtyui.moneytracker.mapper.toCategoryDto


@Repository
class CategoryRepository {
    fun findAllByUser(userId: UUID): List<CategoryResponseDto> =
        transaction {
            (Categories innerJoin UserCategoryRel)
                .select(
                    UserCategoryRel.userId eq userId and UserCategoryRel.isDeleted eq Op.FALSE
                )
                .map { it.toCategoryDto() }
        }

    fun createCategory(categoryCreate: CategoryCreateDto, userUuid: UUID): CategoryResponseDto =
        transaction {

            val categoryUuid = Categories
                .selectAll()
                .where { Categories.name eq categoryCreate.name }
                .map { it[Categories.id].value }
                .singleOrNull()
                ?: Categories.insertAndGetId {
                    it[name] = categoryCreate.name
                    it[type] = categoryCreate.type
                }.value

            UserCategoryRel.insert {
                it[userId] = userUuid
                it[categoryId] = categoryUuid
            }

            CategoryResponseDto(
                categoryUuid,
                categoryCreate.name,
                categoryCreate.type
            )
        }

    fun updateCategory(categoryUpdate: CategoryUpdateDto): CategoryResponseDto =
        transaction {
            val row = Categories
                .selectAll()
                .where { Categories.name eq categoryUpdate.name }
                .limit(1)
                .firstOrNull()
                ?: throw IllegalArgumentException("Категория не найдена")

            val categoryId = row[Categories.id].value

            val usageCount = UserCategoryRel
                .selectAll()
                .where {
                    (UserCategoryRel.categoryId eq categoryId) and
                            (UserCategoryRel.isDeleted eq false)
                }
                .count()

            if (usageCount > 1) {
                throw IllegalStateException("Категорией пользуется больше 1 человека")
            }

            Categories.update({ Categories.id eq categoryId }) {
                it[name] = categoryUpdate.name
                it[updatedAt] = CurrentDateTime
            }

            CategoryResponseDto(
                categoryId,
                categoryUpdate.name,
                row[Categories.type]
            )
        }

    fun deleteCategory(dto: CategoryUpdateDto, userUuid: UUID) =
        transaction {

            val categoryId = Categories
                .selectAll()
                .where { Categories.name eq dto.name }
                .limit(1)
                .firstOrNull()
                ?.get(Categories.id)?.value
                ?: throw IllegalArgumentException("Категория не найдена")

            UserCategoryRel.update({
                (UserCategoryRel.userId eq userUuid) and
                        (UserCategoryRel.categoryId eq categoryId)
            }) {
                it[isDeleted] = true
            }
        }
}