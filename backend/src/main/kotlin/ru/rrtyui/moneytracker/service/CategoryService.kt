package ru.rrtyui.moneytracker.service

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.category.CategoryCreateDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryResponseDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryUpdateDto
import ru.rrtyui.moneytracker.repository.CategoryRepository
import ru.rrtyui.moneytracker.repository.CategoryTreeRepository
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val categoryTreeRepository: CategoryTreeRepository
) {
    fun getAllCategories(user: UserPrincipal): List<CategoryResponseDto> =
        categoryTreeRepository.findUserTree(user.id)


    fun findOrCreateCategory(categoryCreateDto: CategoryCreateDto, user: UserPrincipal): CategoryResponseDto {

        val categoryId = categoryRepository.findOrCreateCategory(categoryCreateDto)
        val createCategory = categoryTreeRepository.insertCategory(categoryId, user.id, categoryCreateDto)

        return createCategory
    }

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

//    fun deleteCategory(categoryUpdate: CategoryUpdateDto, user: UserData) =
//        categoryRepository.deleteCategory(categoryUpdate, user.id)
}