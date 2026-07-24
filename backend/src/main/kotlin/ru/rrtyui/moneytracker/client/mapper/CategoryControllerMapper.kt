package ru.rrtyui.moneytracker.client.mapper

import ru.rrtyui.moneytracker.client.request.CategoryCreateRequest
import ru.rrtyui.moneytracker.client.request.CategoryTypeStatusRequest
import ru.rrtyui.moneytracker.client.response.CategoryResponse
import ru.rrtyui.moneytracker.client.response.CategoryTypeStatusResponse
import ru.rrtyui.moneytracker.services.usecase.model.CategoryCreateCommand
import ru.rrtyui.moneytracker.services.usecase.model.CategoryCreateResult
import ru.rrtyui.moneytracker.services.usecase.model.CategoryTypeCommand

object CategoryControllerMapper {
    fun CategoryCreateRequest.toUseCase() =
        CategoryCreateCommand(
            name = this.name,
            type = this.type.toUseCase(),
            parentId = this.parentId,
        )

    fun CategoryTypeStatusRequest.toUseCase(): CategoryTypeCommand =
        when(this) {
            CategoryTypeStatusRequest.EXPENSE -> CategoryTypeCommand.EXPENSE
            CategoryTypeStatusRequest.INCOME -> CategoryTypeCommand.INCOME
            CategoryTypeStatusRequest.SAVINGS -> CategoryTypeCommand.SAVINGS
        }

    fun CategoryCreateResult.toResponse() =
        CategoryResponse(
            categoryId = this.categoryId,
            parentId = this.parentId,
            linkId = this.linkId,
            name = this.name,
            type = this.type.toResponse(),
        )

    fun CategoryTypeCommand.toResponse(): CategoryTypeStatusResponse =
        when(this) {
            CategoryTypeCommand.EXPENSE -> CategoryTypeStatusResponse.EXPENSE
            CategoryTypeCommand.INCOME -> CategoryTypeStatusResponse.INCOME
            CategoryTypeCommand.SAVINGS -> CategoryTypeStatusResponse.SAVINGS
        }
}