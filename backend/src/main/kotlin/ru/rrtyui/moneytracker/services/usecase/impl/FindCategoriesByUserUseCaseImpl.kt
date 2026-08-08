package ru.rrtyui.moneytracker.services.usecase.impl

import java.util.UUID
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.CategoryService
import ru.rrtyui.moneytracker.services.service.CategoryTreeService
import ru.rrtyui.moneytracker.services.service.model.CategoryServiceModel
import ru.rrtyui.moneytracker.services.service.model.CategoryTreeServiceModel
import ru.rrtyui.moneytracker.services.usecase.FindCategoriesByUserUseCase
import ru.rrtyui.moneytracker.services.usecase.mapper.CategoryMapper.toUseCase
import ru.rrtyui.moneytracker.services.usecase.model.FindCategoriesResult

@Service
class FindCategoriesByUserUseCaseImpl(
    private val categoryTreeService: CategoryTreeService,
    private val categoryService: CategoryService,
    private val actorPrincipalService: ActorPrincipalService,
): FindCategoriesByUserUseCase {
    override fun invoke(): List<FindCategoriesResult> {
        val actorPrincipalId = actorPrincipalService.getCurrentActor().id
        val categoriesLinks = categoryTreeService.findAllLinksByActorId(actorPrincipalId)

        if (categoriesLinks.isEmpty()){
            return emptyList()
        }

        val categoriesLinksMapById = categoriesLinks
            .map { it.categoryId }
            .distinct()

        val categories = categoryService.findAllByIds(categoriesLinksMapById)

        val categoriesById = categories.associateBy { it.id }
        val linksByParentId = categoriesLinks.groupBy { it.parentId }

        val findCategoriesResults = buildTree(
            parentId = null,
            linksByParentId = linksByParentId,
            categoriesById = categoriesById
        )

        return findCategoriesResults
    }

    private fun buildTree(
        parentId: UUID?,
        linksByParentId: Map<UUID?, List<CategoryTreeServiceModel>>,
        categoriesById: Map<UUID, CategoryServiceModel>,
    ): List<FindCategoriesResult> {
        return linksByParentId[parentId]
            .orEmpty()
            .map { link ->
                val category = categoriesById.getValue(link.categoryId)

                FindCategoriesResult(
                    categoryId = category.id,
                    name = category.name,
                    type = category.type.toUseCase(),
                    childCategories = buildTree(
                        parentId = category.id,
                        linksByParentId = linksByParentId,
                        categoriesById = categoriesById,
                    ),
                )
            }
    }
}