package ru.rrtyui.moneytracker.services.service.impl

import java.util.UUID
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import ru.rrtyui.moneytracker.services.persistence.entity.CategoryTreeEntity
import ru.rrtyui.moneytracker.services.persistence.mapper.toServiceModel
import ru.rrtyui.moneytracker.services.persistence.repository.CategoryTreeRepository
import ru.rrtyui.moneytracker.services.service.CategoryTreeService
import ru.rrtyui.moneytracker.services.service.mapper.CategoryServiceMapper.toCreateRow
import ru.rrtyui.moneytracker.services.service.mapper.CategoryServiceMapper.toUpdateRow
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeServiceModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeUpdateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeValidateModel

@Service
class CategoryTreeServiceImpl(
    private val categoryTreeRepository: CategoryTreeRepository
): CategoryTreeService {
    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    override fun findAllLinksByActorId(actorId: UUID): List<CategoryTreeServiceModel> {
        val treeEntities = categoryTreeRepository.findAllByActorId(actorId)
        val serviceModels = treeEntities.map { it.toServiceModel() }

        return serviceModels
    }
    @Transactional(propagation = Propagation.REQUIRED)
    override fun createLink(categoryTreeCreateModel: CategoryTreeCreateModel): CategoryTreeServiceModel {
        val createdLink = categoryTreeRepository.createLink(categoryTreeCreateModel.toCreateRow())

        return createdLink.toServiceModel()
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    override fun checkExist(userId: UUID, categoryId: UUID) {
        val existByUserIdAndCategoryId = categoryTreeRepository.existByUserIdAndCategoryId(userId, categoryId)

        if (existByUserIdAndCategoryId) {
            throw RuntimeException("Категория $categoryId уже существует у пользователя $userId")
        }
    }

    @Transactional(propagation = Propagation.REQUIRED)
    override fun updateLink(categoryTreeUpdateModel: CategoryTreeUpdateModel) {
        val updateRow = categoryTreeUpdateModel.toUpdateRow()

        val updateCount = categoryTreeRepository.update(updateRow)

        if (updateCount == 0) {
            throw RuntimeException("Я хуй знает как такое может произойти при обновлении")
        }
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    override fun validateParent(categoryTreeValidateModel: CategoryTreeValidateModel) {
        val categoryId = categoryTreeValidateModel.categoryId
        val parentId = categoryTreeValidateModel.parentId
        val actorId = categoryTreeValidateModel.actorId

        if (categoryId == parentId) {
            throw RuntimeException("Category cannot be its own parent")
        }

        if (!categoryTreeRepository.existByParentId(parentId)) {
            throw RuntimeException("Parent category with id $parentId does not exist")
        }

        val links = categoryTreeRepository.findAllByActorId(actorId)
        if (checkCyclicRelation(categoryId, parentId, links)) {
            throw RuntimeException("Cyclic dependency detected in category tree")
        }
    }

    private fun checkCyclicRelation(categoryId: UUID, newParentId: UUID, links: List<CategoryTreeEntity>): Boolean {
        val linksByCategory = links.associateBy(CategoryTreeEntity::categoryId)

        var currentCategoryId: UUID? = newParentId

        while (currentCategoryId != null) {
            if (currentCategoryId == categoryId) {
                return true
            }

            currentCategoryId = linksByCategory[currentCategoryId]?.parentId
        }

        return false
    }
}