package ru.rrtyui.moneytracker.services.usecase.impl

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.CategoryTreeService
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeCreateModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeValidateModel
import ru.rrtyui.moneytracker.services.usecase.CategoryCreateUseCase
import ru.rrtyui.moneytracker.services.usecase.mapper.CategoryMapper.toServiceModel
import ru.rrtyui.moneytracker.services.usecase.mapper.CategoryMapper.toUseCase
import ru.rrtyui.moneytracker.services.usecase.model.CategoryCreateCommand
import ru.rrtyui.moneytracker.services.usecase.model.CategoryCreateResult

@Service
class CategoryCreateUseCaseImpl(
    private val actorPrincipalService: ActorPrincipalService,
    private val categoryService: CategoryService,
    private val categoryTreeService: CategoryTreeService,
): CategoryCreateUseCase {
    override fun invoke(command: CategoryCreateCommand): CategoryCreateResult {
        val actorPrincipal = actorPrincipalService.getCurrentActor()
        /**
         * Найти по имени категорию, если нал то создать и получить у нее айди.
         * Проверить что
         * - если родитель передан то он существует
         * - не ссылается ли родитель сам на себя
         * - не является ли родитель уже потомком своего потомка
         * - нет ли циклической связи
         *
         * Получив айди категории и проверив что родитель корректен (будет создан метод для всех шагов проверок
         * создаем связь userId - catId - parentCatId
         *
         * Собираем ответ, где все данные получены из первого сервиса кроме parentId
         */

        val categoryCreateModel = command.toServiceModel(actorPrincipal)

        val categoryServiceModel = categoryService.create(categoryCreateModel)

        if (command.parentId != null) {
            val validateModel = CategoryTreeValidateModel(
                categoryId = categoryServiceModel.id,
                parentId = command.parentId,
                actorId = actorPrincipal.id
            )

            categoryTreeService.validateParent(validateModel)
            //TODO если указывается родительская категория, то дочерняя должна наследовать тип категории родительской
        }

        val treeCreateModel = CategoryTreeCreateModel(
            categoryId = categoryServiceModel.id,
            parentId = command.parentId,
            actorId = actorPrincipal.id
        )

        val categoryLink = categoryTreeService.createLink(treeCreateModel)

        val result = CategoryCreateResult(
            categoryId = categoryServiceModel.id,
            linkId = categoryLink.id,
            parentId = categoryLink.parentId,
            name = categoryServiceModel.name,
            type = categoryServiceModel.type.toUseCase(),
        )

        return result
    }
}