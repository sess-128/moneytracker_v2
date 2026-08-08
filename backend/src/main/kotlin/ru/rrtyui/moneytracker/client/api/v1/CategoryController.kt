package ru.rrtyui.moneytracker.client.api.v1

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
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
import ru.rrtyui.moneytracker.services.service.impl.CategoryServiceImpl
import ru.rrtyui.moneytracker.services.usecase.CategoryCreateUseCase
import ru.rrtyui.moneytracker.services.usecase.CategoryUpdateUseCase
import ru.rrtyui.moneytracker.services.usecase.FindCategoriesByUserUseCase


@RestController
@RequestMapping("$API_V1/$CATEGORIES_URL")
@Tag(name = "Работа с категориями", description = "API для CRUD-операций с категориями")
class CategoryController(
    private val categoryServiceImpl: CategoryServiceImpl,
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

    @PutMapping
    @Operation(description = "Обновить имя категории")
    fun updateCategory(
        @RequestBody request: CategoryUpdateRequest,
    ): ResponseEntity<Unit> {
        val command = request.toUseCase()
        categoryUpdateUseCase.invoke(command)
        return ResponseEntity.ok().build()
    }

//    @DeleteMapping
//    fun deleteCategory(
//        @ParameterObject request: CategoryUpdateDto,
//        @AuthenticationPrincipal user: UserPrincipal
//    ): ResponseEntity<Int?> {
//        logger.info { "Пользователь ${user.id} удаляет свою связь с категорией $request" }
//        return ResponseEntity.ok(categoryService.deleteCategory(request, user))
//    }
}