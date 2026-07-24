package ru.rrtyui.moneytracker.services.service.impl

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import ru.rrtyui.moneytracker.client.request.CategoryCreateRequest
import ru.rrtyui.moneytracker.client.request.CategoryUpdateRequest
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.services.persistence.mapper.toServiceModel
import ru.rrtyui.moneytracker.services.persistence.repository.CategoryRepository
import ru.rrtyui.moneytracker.services.persistence.repository.impl.CategoryTreeRepositoryImpl
import ru.rrtyui.moneytracker.application.security.data.UserPrincipal
import ru.rrtyui.moneytracker.services.persistence.repository.CategoryTreeRepository
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.mapper.CategoryServiceMapper.toCategoryCreateRow
import ru.rrtyui.moneytracker.services.service.model.CategoryCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryServiceModel

@Service
class CategoryServiceImpl(
    private val categoryRepository: CategoryRepository,
    private val categoryTreeRepositoryImpl: CategoryTreeRepository
): CategoryService {
    fun getAllCategories(user: UserPrincipal): List<CategoryResponse> =
        categoryTreeRepositoryImpl.findUserTree(user.id)


    fun findOrCreateCategory(categoryCreateRequest: CategoryCreateRequest, user: UserPrincipal): CategoryResponse {

        val categoryId = categoryRepositoryImpl.findOrCreateCategory(categoryCreateRequest)
        val createCategory = categoryTreeRepositoryImpl.insertCategory(categoryId, user.id, categoryCreateRequest)

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
        return categoryRepositoryImpl.updateCategory(categoryUpdate)
    }

    override fun getAllCategories() {
        TODO("Not yet implemented")
    }

    @Transactional(propagation = Propagation.REQUIRED)
    override fun create(createModel: CategoryCreateModel): CategoryServiceModel {
        val existingCategory = categoryRepository.findByName(createModel.name)
        if (existingCategory != null) {
            return existingCategory.toServiceModel()
        }

        val categoryCreateRow = createModel.toCategoryCreateRow()
        val createdEntity = categoryRepository.create(categoryCreateRow)

        return createdEntity.toServiceModel()
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    override fun existByName(name: String): Boolean =
        categoryRepository.existByName(name)


//    fun deleteCategory(categoryUpdate: CategoryUpdateDto, user: UserData) =
//        categoryRepository.deleteCategory(categoryUpdate, user.id)
}