package ru.rrtyui.moneytracker.service

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.client.request.CategoryCreateRequest
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.client.request.CategoryUpdateRequest
import ru.rrtyui.moneytracker.repository.CategoryRepository
import ru.rrtyui.moneytracker.repository.CategoryTreeRepository
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val categoryTreeRepository: CategoryTreeRepository
) {
    fun getAllCategories(user: UserPrincipal): List<CategoryResponse> =
        categoryTreeRepository.findUserTree(user.id)


    fun findOrCreateCategory(categoryCreateRequest: CategoryCreateRequest, user: UserPrincipal): CategoryResponse {

        val categoryId = categoryRepository.findOrCreateCategory(categoryCreateRequest)
        val createCategory = categoryTreeRepository.insertCategory(categoryId, user.id, categoryCreateRequest)

        return createCategory
    }

    /**
     * TODO: Так как категории шареные, то изменять как-либо категорию = поменять ее у всех.
     * Изменение категории возможно только если категорий пользуется только 1 человек, что вполне вероятно
     * То есть для написания этого метода сначала
     * - проверить что таблица в пользовании у 1 человека
     * - изменять
     */
    fun updateCategory(categoryUpdate: CategoryUpdateRequest): CategoryResponse {
        return categoryRepository.updateCategory(categoryUpdate)
    }

//    fun deleteCategory(categoryUpdate: CategoryUpdateDto, user: UserData) =
//        categoryRepository.deleteCategory(categoryUpdate, user.id)
}