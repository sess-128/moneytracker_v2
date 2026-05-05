package ru.rrtyui.moneytracker.service

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.category.CategoryCreateDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryResponseDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryUpdateDto
import ru.rrtyui.moneytracker.entity.CategoryType
import ru.rrtyui.moneytracker.repository.CategoryRepository
import ru.rrtyui.moneytracker.service.security.data.UserData
import java.util.*

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository
) {
    fun getAllCategories(user: UserData): List<CategoryResponseDto> =
        categoryRepository.findAllByUser(user.id)


    fun createCategory(categoryCreate: CategoryCreateDto, user: UserData): CategoryResponseDto =
        categoryRepository.createCategory(categoryCreate, user.id)

    /**
     * TODO: Так как категории шареные, то изменять как-либо категорию = поменять ее у всех.
     * Изменение категории возможно только если категорий пользуется только 1 человек, что вполне вероятно
     * То есть для написания этого метода сначала
     * - проверить что таблица в пользовании у 1 человека
     * - изменять
     */
    fun updateCategory(categoryUpdate: CategoryUpdateDto): CategoryResponseDto {
        return categoryRepository.updateCategory(categoryUpdate)
    }

    fun deleteCategory(categoryUpdate: CategoryUpdateDto, user: UserData) =
        categoryRepository.deleteCategory(categoryUpdate, user.id)
}