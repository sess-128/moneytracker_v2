package ru.rrtyui.moneytracker.service

import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.transaction.CreateTransactionRequestDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionRequestFilterDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionResponseDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionUpdateRequestDto
import ru.rrtyui.moneytracker.repository.TransactionRepository
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository
) {
    fun getAllTransactionsByUser(principal: UserPrincipal):
            List<TransactionResponseDto> = transactionRepository.findByUser(principal)

    fun getTransactionByFilter(filterDto: TransactionRequestFilterDto) {
        TODO("Not implemented yet")
    }

    fun createTransactionByUser(principal: UserPrincipal, createTransactionRequestDto: CreateTransactionRequestDto): TransactionResponseDto =
        transactionRepository.createTransaction(createTransactionRequestDto, principal.id,)


    fun updateTransactionByUser(transactionUpdateRequestDto: TransactionUpdateRequestDto) =
        transactionRepository.updateTransaction(transactionUpdateRequestDto)
}