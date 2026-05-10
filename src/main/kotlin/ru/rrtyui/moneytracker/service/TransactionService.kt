package ru.rrtyui.moneytracker.service

import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionRequestDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionRequestFilterDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionResponseDto
import ru.rrtyui.moneytracker.api.dto.transaction.TransactionUpdateRequestDto
import ru.rrtyui.moneytracker.entity.Categories
import ru.rrtyui.moneytracker.exception.CategoryNotFoundException
import ru.rrtyui.moneytracker.repository.TransactionRepository
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository
) {
    fun getAllTransactionsByUser(principal: UserPrincipal):
            List<TransactionResponseDto> = transactionRepository.findTransactionsByUser(principal)

    fun getTransactionByFilter(filterDto: TransactionRequestFilterDto) {
        TODO("Not implemented yet")
    }

    fun createTransactionByUser(principal: UserPrincipal, transactionRequestDto: TransactionRequestDto): TransactionResponseDto = transaction {
        val category = Categories
            .select(Categories.id)
            .where { Categories.name eq transactionRequestDto.categoryName }
            .map { it[Categories.id] }
            .singleOrNull()  ?: throw CategoryNotFoundException("Category by name ${transactionRequestDto.categoryName} not found")
        transactionRepository.insertNewTransaction(transactionRequestDto, principal.id, category.value)
    }

    fun updateTransactionByUser(transactionUpdateRequestDto: TransactionUpdateRequestDto) =
        transactionRepository.updateTransaction(transactionUpdateRequestDto)
}