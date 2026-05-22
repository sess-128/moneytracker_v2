package ru.rrtyui.moneytracker.client.api.v1

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springdoc.core.annotations.ParameterObject
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.client.RestConstants.API_V1
import ru.rrtyui.moneytracker.client.RestConstants.TRANSACTIONS_URL
import ru.rrtyui.moneytracker.client.request.TransactionCreateRequest
import ru.rrtyui.moneytracker.client.request.TransactionFilterRequest
import ru.rrtyui.moneytracker.client.request.TransactionUpdateRequest
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.services.security.data.UserPrincipal
import ru.rrtyui.moneytracker.services.service.TransactionService

@RestController
@RequestMapping("$API_V1/$TRANSACTIONS_URL")
@Tag(name = "Работа с транзакциями", description = "API для CRUD-операций с транзакциями")
class TransactionController(
    private val transactionService: TransactionService
) {
    @GetMapping
    @Operation(description = "Получить все транзакции пользователя")
    fun getTransactions(
        @AuthenticationPrincipal principal: UserPrincipal
    ) =
        ok(transactionService.getAllTransactionsByUser(principal))


    @GetMapping("/by-filter")
    @Operation(description = "Получить все транзакции пользователя по заданным фильтрам")
    fun getTransactionByFilter(
        @ParameterObject filterDto: TransactionFilterRequest
    ): ResponseEntity<List<TransactionResponse>> =
        ok(transactionService.getTransactionByFilter(filterDto))


    @PostMapping
    @Operation(description = "Создать новую транзакцию")
    fun createTransaction(
        @RequestBody transactionCreateRequest: TransactionCreateRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ) =
        ok(transactionService.createTransactionByUser(principal, transactionCreateRequest))

    @PutMapping
    @Operation(description = "Обновить дату транзакции")
    fun updateTransaction(
        @RequestBody transactionRequestDto: TransactionUpdateRequest
    ) =
        ok(transactionService.updateTransactionByUser(transactionRequestDto))
}