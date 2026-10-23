package ru.rrtyui.moneytracker.client.api.v1

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.client.RestConstants.API_V1
import ru.rrtyui.moneytracker.client.RestConstants.TRANSACTIONS_URL
import ru.rrtyui.moneytracker.client.RestConstants.TRANSACTION_ID
import ru.rrtyui.moneytracker.client.mapper.TransactionControllerMapper.toCommand
import ru.rrtyui.moneytracker.client.mapper.TransactionControllerMapper.toResponse
import ru.rrtyui.moneytracker.client.request.TransactionCreateRequest
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.services.usecase.FindTransactionsByUserUseCase
import ru.rrtyui.moneytracker.services.usecase.TransactionCreateUseCase
import ru.rrtyui.moneytracker.services.usecase.TransactionDeleteUseCase

@RestController
@RequestMapping("$API_V1/$TRANSACTIONS_URL")
@Tag(name = "Работа с транзакциями", description = "API для CRUD-операций с транзакциями")
class TransactionController(
    private val transactionCreateUseCase: TransactionCreateUseCase,
    private val findTransactionsByUserUseCase: FindTransactionsByUserUseCase,
    private val transactionDeleteUseCase: TransactionDeleteUseCase,
) {
    @GetMapping
    @Operation(description = "Получить все транзакции пользователя")
    fun findAllTransactions(): ResponseEntity<List<TransactionResponse>> {
        val result = findTransactionsByUserUseCase.invoke()
        val response = result.map { it.toResponse() }
        return ResponseEntity.ok(response)
    }

    @PostMapping
    @Operation(description = "Создать новую транзакцию")
    fun createTransaction(
        @RequestBody request: TransactionCreateRequest,
    ): ResponseEntity<TransactionResponse> {
        val command = request.toCommand()
        val result = transactionCreateUseCase.invoke(command)
        val response = result.toResponse()

        return ResponseEntity.ok(response)
    }

    //TODO пока отложено - на данном этапе проще удалить и написать заново
//    @PatchMapping
//    @Operation(description = "Обновить дату транзакции")
//    fun updateTransaction(
//        @RequestBody transactionRequestDto: TransactionUpdateRequest
//    ) =
//        ok(transactionServiceImpl.updateTransactionByUser(transactionRequestDto))

    @DeleteMapping("/{$TRANSACTION_ID}")
    @Operation(description = "Создать новую транзакцию")
    fun deleteTransaction(
        @PathVariable(TRANSACTION_ID) transactionId: UUID,
    ): ResponseEntity<Unit> {
        transactionDeleteUseCase.invoke(transactionId)

        return ResponseEntity.noContent().build()
    }
}