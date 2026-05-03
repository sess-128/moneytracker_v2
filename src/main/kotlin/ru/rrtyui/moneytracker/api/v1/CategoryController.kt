package ru.rrtyui.moneytracker.api.v1

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.api.dto.category.CategoryResponseDto

@RestController("api/category")
class CategoryController {

    @GetMapping("/categories")
    fun getCategories(): List<CategoryResponseDto> {
        return listOf(CategoryResponseDto("All Categories", "All Categories"))
    }
}