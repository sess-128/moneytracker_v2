package ru.rrtyui.moneytracker.services.service

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.client.request.TransactionCreateRequest
import ru.rrtyui.moneytracker.client.request.TransactionFilterRequest
import ru.rrtyui.moneytracker.client.request.TransactionUpdateRequest
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.services.security.data.UserPrincipal
import ru.rrtyui.moneytracker.services.persistence.repository.TransactionRepository

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository
) {
    fun getAllTransactionsByUser(principal: UserPrincipal):
            List<TransactionResponse> = transactionRepository.findByUser(principal)

    fun getTransactionByFilter(filterDto: TransactionFilterRequest) {
        TODO("Not implemented yet")
    }

    fun createTransactionByUser(principal: UserPrincipal, transactionCreateRequest: TransactionCreateRequest): TransactionResponse =
        transactionRepository.createTransaction(transactionCreateRequest, principal.id,)


    fun updateTransactionByUser(transactionUpdateRequest: TransactionUpdateRequest) =
        transactionRepository.updateTransaction(transactionUpdateRequest)
}