package ru.rrtyui.moneytracker.services.service.impl

import java.util.UUID
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import ru.rrtyui.moneytracker.services.persistence.mapper.toServiceModel
import ru.rrtyui.moneytracker.services.persistence.repository.CategoryRepository
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.mapper.CategoryServiceMapper.toCategoryCreateRow
import ru.rrtyui.moneytracker.services.service.model.CategoryCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryServiceModel

@Service
class CategoryServiceImpl(
    private val categoryRepository: CategoryRepository,
): CategoryService {
    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    override fun findByName(name: String): CategoryServiceModel? {
        val category = categoryRepository.getByName(name)
        return category?.toServiceModel()
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    override fun findById(id: UUID): CategoryServiceModel? {
        val category = categoryRepository.findById(id)
        return category?.toServiceModel()
    }

    @Transactional(propagation = Propagation.REQUIRED)
    override fun findAllByIds(categoriesIds: List<UUID>): List<CategoryServiceModel> {
        val findByIds = categoryRepository.findByIds(categoriesIds)

        return findByIds.map { it.toServiceModel() }
    }

    @Transactional(propagation = Propagation.REQUIRED)
    override fun create(createModel: CategoryCreateModel): CategoryServiceModel {
        val existingCategory = categoryRepository.getByName(createModel.name)
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
}