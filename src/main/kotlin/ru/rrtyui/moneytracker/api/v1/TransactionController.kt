package ru.rrtyui.moneytracker.api.v1

import org.springframework.http.ResponseEntity.ok
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionRequestDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionRequestFilterDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionUpdateRequestDto
import ru.rrtyui.moneytracker.service.TransactionService
import ru.rrtyui.moneytracker.service.data.UserData
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@RestController
@RequestMapping("/api/v1/transactions")
class TransactionController(private val transactionService: TransactionService) {

    @GetMapping
    fun getTransactionsByUser(@AuthenticationPrincipal principal: UserPrincipal) =
        ok(transactionService.getAllTransactionsByUser(principal))


    @PostMapping("/by-filter")
    fun getTransactionByFilter(@RequestBody filterDto: TransactionRequestFilterDto) =
        ok(transactionService.getTransactionByFilter(filterDto))

    @PostMapping
    fun createTransaction(
        @AuthenticationPrincipal principal: UserPrincipal,
        @RequestBody transactionRequestDto: TransactionRequestDto
    ) =
        ok(transactionService.createTransactionByUser(principal, transactionRequestDto))

    @PutMapping
    fun updateTransaction(@RequestBody transactionRequestDto: TransactionUpdateRequestDto) =
        ok(transactionService.updateTransactionByUser(transactionRequestDto))
}