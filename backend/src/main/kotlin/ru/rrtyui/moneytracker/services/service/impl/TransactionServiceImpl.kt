package ru.rrtyui.moneytracker.services.service.impl

import java.math.BigDecimal
import java.util.UUID
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.application.security.data.UserPrincipal
import ru.rrtyui.moneytracker.client.request.TransactionCreateRequest
import ru.rrtyui.moneytracker.client.request.TransactionFilterRequest
import ru.rrtyui.moneytracker.client.request.TransactionUpdateRequest
import ru.rrtyui.moneytracker.client.response.TransactionResponse
import ru.rrtyui.moneytracker.services.persistence.repository.TransactionRepository
import ru.rrtyui.moneytracker.services.persistence.repository.impl.TransactionRepositoryImpl
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toCreateRow
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toServiceModel
import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel

@Service
class TransactionServiceImpl(
    private val transactionRepositoryImpl: TransactionRepositoryImpl,
    private val transactionRepository: TransactionRepository
): TransactionService {
    fun getAllTransactionsByUser(principal: UserPrincipal):
            List<TransactionResponse> = transactionRepositoryImpl.findByUser(principal)

    fun getTransactionByFilter(filterDto: TransactionFilterRequest): List<TransactionResponse> {
        return listOf(
            TransactionResponse(
                UUID.randomUUID(),
                UUID.randomUUID(),
                BigDecimal.ONE,
                null,
                null,
            )
        )
    }

    fun createTransactionByUser(principal: UserPrincipal, transactionCreateRequest: TransactionCreateRequest): TransactionResponse =
        transactionRepositoryImpl.createTransaction(transactionCreateRequest, principal.id,)


    fun updateTransactionByUser(transactionUpdateRequest: TransactionUpdateRequest) =
        transactionRepositoryImpl.updateTransaction(transactionUpdateRequest)

    override fun create(createModel: TransactionCreateModel): TransactionServiceModel {
        val createRow = createModel.toCreateRow()
        val transaction = transactionRepository.createTransaction(createRow)
        return transaction.toServiceModel()
    }
}