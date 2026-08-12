package ru.rrtyui.moneytracker.services.usecase.impl

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.CategoryTreeService
import ru.rrtyui.moneytracker.services.service.model.CategoryCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeUpdateModel
import ru.rrtyui.moneytracker.services.usecase.CategoryUpdateUseCase
import ru.rrtyui.moneytracker.services.usecase.model.CategoryUpdateCommand

@Service
class CategoryUpdateUseCaseImpl(
    private val actorPrincipalService: ActorPrincipalService,
    private val categoryService: CategoryService,
    private val categoryTreeService: CategoryTreeService,
): CategoryUpdateUseCase {
    @Transactional(propagation = Propagation.REQUIRED)
    override fun invoke(command: CategoryUpdateCommand) {
        val actorPrincipal = actorPrincipalService.getCurrentActor()
        val oldCategory = categoryService.getById(command.oldCategoryId)

        categoryTreeService.checkExist(actorPrincipal.id, oldCategory.id)

        if (command.name == oldCategory.name) {
            throw RuntimeException("Старое наименование категории совпадает с новым")
        }

        val categoryCreateModel = CategoryCreateModel(
            name = command.name,
            type = oldCategory.type,
            actorId = actorPrincipal.id,
            actorName = actorPrincipal.username
        )
        val newCategory = categoryService.create(categoryCreateModel)

        val updateTreeModel = CategoryTreeUpdateModel(
            oldCategoryId = oldCategory.id,
            newCategoryId = newCategory.id,
            actorId = actorPrincipal.id
        )
        categoryTreeService.updateLink(updateTreeModel)

        //TODO Добавить замену категории у транзакций
    }
}