package ru.rrtyui.moneytracker.api

import lombok.extern.slf4j.Slf4j
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.api.dto.CategoryResponseDto

@Slf4j
@RestController("api/category")
class CategoryController {

    @GetMapping("/categories")
    fun getCategories(): List<CategoryResponseDto> {
        return listOf(CategoryResponseDto("All Categories", "All Categories"))
    }
}