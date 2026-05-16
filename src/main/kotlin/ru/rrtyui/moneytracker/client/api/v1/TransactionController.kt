package ru.rrtyui.moneytracker.client.api.v1

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
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.security.data.UserPrincipal

@RestController
@RequestMapping("$API_V1/$TRANSACTIONS_URL")
class TransactionController(
    private val transactionService: TransactionService
) {

    @GetMapping
    fun getTransactionsByUser(@AuthenticationPrincipal principal: UserPrincipal) =
        ok(transactionService.getAllTransactionsByUser(principal))


    @PostMapping("/by-filter")
    fun getTransactionByFilter(@RequestBody filterDto: TransactionFilterRequest) =
        ok(transactionService.getTransactionByFilter(filterDto))

    @PostMapping
    fun createTransaction(
        @RequestBody transactionCreateRequest: TransactionCreateRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ) =
        ok(transactionService.createTransactionByUser(principal, transactionCreateRequest))

    @PutMapping
    fun updateTransaction(@RequestBody transactionRequestDto: TransactionUpdateRequest) =
        ok(transactionService.updateTransactionByUser(transactionRequestDto))
}