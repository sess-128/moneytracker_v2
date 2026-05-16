package ru.rrtyui.moneytracker.services.service

import java.math.BigDecimal
import java.util.UUID
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.client.request.TransactionCreateRequest
import ru.rrtyui.moneytracker.client.request.TransactionFilterRequest
import ru.rrtyui.moneytracker.client.request.TransactionUpdateRequest
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.services.persistence.repository.TransactionRepository
import ru.rrtyui.moneytracker.services.security.data.UserPrincipal

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository
) {
    fun getAllTransactionsByUser(principal: UserPrincipal):
            List<TransactionResponse> = transactionRepository.findByUser(principal)

    fun getTransactionByFilter(filterDto: TransactionFilterRequest): List<TransactionResponse> {
        return listOf(TransactionResponse(
            UUID.randomUUID(),
            UUID.randomUUID(),
            BigDecimal.ONE,
            null,
            null,
        ))
    }

    fun createTransactionByUser(principal: UserPrincipal, transactionCreateRequest: TransactionCreateRequest): TransactionResponse =
        transactionRepository.createTransaction(transactionCreateRequest, principal.id,)


    fun updateTransactionByUser(transactionUpdateRequest: TransactionUpdateRequest) =
        transactionRepository.updateTransaction(transactionUpdateRequest)
}