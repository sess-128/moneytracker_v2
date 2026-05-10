package ru.rrtyui.moneytracker.api.v1

import mu.KLogger
import mu.KotlinLogging
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.api.dto.category.CategoryCreateDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryResponseDto
import ru.rrtyui.moneytracker.api.dto.category.CategoryUpdateDto
import ru.rrtyui.moneytracker.service.CategoryService
import ru.rrtyui.moneytracker.service.data.UserPrincipal


@RestController
@RequestMapping("api/categories")
class CategoryController(
    private val logger: KLogger = KotlinLogging.logger {},
    val categoryService: CategoryService
){

    @GetMapping()
    fun getCategories(
        @AuthenticationPrincipal user: UserPrincipal
    ): ResponseEntity<List<CategoryResponseDto>> {
        logger.info { "Пользователь  ${user.id}  список всех категорий" }
        return ResponseEntity.ok(categoryService.getAllCategories(user))
    }

    @PostMapping
    fun createCategory(
        @RequestBody request: CategoryCreateDto,
        @AuthenticationPrincipal user: UserPrincipal
    ): ResponseEntity<CategoryResponseDto> {
        logger.info { "Пользователь ${user.id} создает категорию $request" }
        return ResponseEntity.ok(categoryService.findOrCreateCategory(request, user))
    }

    @PatchMapping
    @Deprecated("Т.к категории шареные - пока отключено, решить позже")
    fun updateCategory(
        @RequestBody request: CategoryUpdateDto,
        @AuthenticationPrincipal user: UserPrincipal
    ): ResponseEntity<CategoryResponseDto> {
        logger.info { "Пользователь ${user.id} обновляет наименование категории на имя = ${request.name}" }
        return ResponseEntity.ok(categoryService.updateCategory(request))
    }

//    @DeleteMapping
//    fun deleteCategory(
//        @RequestBody request: CategoryUpdateDto,
//        @AuthenticationPrincipal user: UserPrincipal
//    ): ResponseEntity<Int?> {
//        logger.info { "Пользователь ${user.id} удаляет свою связь с категорией $request" }
//        return ResponseEntity.ok(categoryService.deleteCategory(request, user))
//    }
}