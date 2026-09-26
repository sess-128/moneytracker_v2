package ru.rrtyui.moneytracker.services.service

import java.util.UUID
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeServiceModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeUpdateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeValidateModel

interface CategoryTreeService {
    fun findAllLinksByActorId(actorId: UUID): List<CategoryTreeServiceModel>

    fun createLink(categoryTreeCreateModel: CategoryTreeCreateModel): CategoryTreeServiceModel

    fun checkExist(
        userId: UUID,
        categoryId: UUID
    )

    fun existByCategoryId(
        userId: UUID,
        categoryId: UUID
    ): Boolean

    fun checkIsLastSubCategory(
        userId: UUID,
        categoryId: UUID
    )

    fun updateLink(categoryTreeUpdateModel: CategoryTreeUpdateModel)

    fun validateParent(
        categoryTreeValidateModel: CategoryTreeValidateModel,
    )
}