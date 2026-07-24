package ru.rrtyui.moneytracker.services.service

import java.util.UUID
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeServiceModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeValidateModel

interface CategoryTreeService {
    fun findAllLinksByActorId(actorId: UUID)

    fun createLink(categoryTreeCreateModel: CategoryTreeCreateModel): CategoryTreeServiceModel

    fun removeLink(
        categoryId: UUID
    )

    fun updateLink(

    )

    fun validateParent(
        categoryTreeValidateModel: CategoryTreeValidateModel,
    )
}