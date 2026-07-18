package ru.rrtyui.moneytracker.client.api.v1

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.client.RestConstants.API_V1
import ru.rrtyui.moneytracker.client.RestConstants.CATEGORIES_URL
import ru.rrtyui.moneytracker.client.request.CategoryCreateRequest
import ru.rrtyui.moneytracker.client.request.CategoryUpdateRequest
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.services.security.data.UserPrincipal
import ru.rrtyui.moneytracker.services.service.CategoryService


@RestController
@RequestMapping("$API_V1/$CATEGORIES_URL")
@Tag(name = "Работа с категориями", description = "API для CRUD-операций с категориями")
class CategoryController(
    private val categoryService: CategoryService
){
    @GetMapping()
    @Operation(description = "Получить все категории пользователя")
    fun getCategories(
        @AuthenticationPrincipal user: UserPrincipal
    ): ResponseEntity<List<CategoryResponse>> {
        return ResponseEntity.ok(categoryService.getAllCategories(user))
    }

    @PostMapping
    @Operation(description = "Создать новую категорию")
    fun createCategory(
        @RequestBody request: CategoryCreateRequest,
        @AuthenticationPrincipal user: UserPrincipal
    ): ResponseEntity<CategoryResponse> {
        return ResponseEntity.ok(categoryService.findOrCreateCategory(request, user))
    }

    @PatchMapping
    @Operation(description = "Обновить имя категории")
    @Deprecated("Т.к категории шареные - пока отключено, решить позже")
    fun updateCategory(
        @RequestBody request: CategoryUpdateRequest,
        @AuthenticationPrincipal user: UserPrincipal
    ): ResponseEntity<CategoryResponse> {
        return ResponseEntity.ok(categoryService.updateCategory(request))
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