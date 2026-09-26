package ru.rrtyui.moneytracker.client.api.v1

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.client.RestConstants.API_V1
import ru.rrtyui.moneytracker.client.RestConstants.CATEGORIES_URL
import ru.rrtyui.moneytracker.client.mapper.CategoryControllerMapper.toResponse
import ru.rrtyui.moneytracker.client.mapper.CategoryControllerMapper.toUseCase
import ru.rrtyui.moneytracker.client.request.CategoryCreateRequest
import ru.rrtyui.moneytracker.client.request.CategoryUpdateRequest
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.client.response.FindCategoriesByUserResponse
import ru.rrtyui.moneytracker.services.usecase.CategoryCreateUseCase
import ru.rrtyui.moneytracker.services.usecase.CategoryUpdateUseCase
import ru.rrtyui.moneytracker.services.usecase.FindCategoriesByUserUseCase


@RestController
@RequestMapping("$API_V1/$CATEGORIES_URL")
@Tag(name = "Работа с категориями", description = "API для CRUD-операций с категориями")
class CategoryController(
    private val categoryCreateUseCase: CategoryCreateUseCase,
    private val categoryUpdateUseCase: CategoryUpdateUseCase,
    private val findCategoriesByUserUseCase: FindCategoriesByUserUseCase,
){
    @GetMapping()
    @Operation(description = "Получить все категории пользователя")
    fun getAllCategories(): ResponseEntity<List<FindCategoriesByUserResponse>> {
        val result = findCategoriesByUserUseCase.invoke()
        val response = result.map { it.toResponse() }
        return ResponseEntity.ok(response)
    }

    @PostMapping
    @Operation(description = "Создать новую категорию")
    fun createCategory(
        @RequestBody request: CategoryCreateRequest,
    ): ResponseEntity<CategoryResponse> {
        val command = request.toUseCase()
        val result = categoryCreateUseCase.invoke(command)
        val response = result.toResponse()
        return ResponseEntity.ok(response)
    }

    @PatchMapping
    @Operation(description = "Обновить имя категории")
    fun updateCategory(
        @RequestBody request: CategoryUpdateRequest,
    ): ResponseEntity<Unit> {
        val command = request.toUseCase()
        categoryUpdateUseCase.invoke(command)
        return ResponseEntity.ok().build()
    }

    //TODO удаление категории несет большие проверки, а именно:
    /**
     * - является ли категория родительской? Если да, то что делать с дочерними? Переносить на другого? Делать все дочерние родительскими? Как будто
     * потенциально лучше заставить пользователя сделать перенос всех дочерних категорий на нового родителя, чтобы у удаляемой категории не было
     * дочерних категорий
     * - если категория НЕродительская, то нужно
     * 1) заставить пользователя перенести все дочерние категории на новую категорию
     * то есть по сути мы должны сделать апдейт как в обновлении категории и просто обновить старыйАйди на новый и удалить связь со старой, пока не приоритет
     */
//    @DeleteMapping
//    fun deleteCategory(
//        @ParameterObject request: CategoryUpdateDto,
//        @AuthenticationPrincipal user: UserPrincipal
//    ): ResponseEntity<Int?> {
//        logger.info { "Пользователь ${user.id} удаляет свою связь с категорией $request" }
//        return ResponseEntity.ok(categoryService.deleteCategory(request, user))
//    }
}