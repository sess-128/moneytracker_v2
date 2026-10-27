package ru.rrtyui.moneytracker.services.service.impl

import java.util.UUID
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import ru.rrtyui.moneytracker.services.persistence.repository.TransactionRepository
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toCreateRow
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toFilterRow
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toReplaceRow
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toServiceModel
import ru.rrtyui.moneytracker.services.service.model.FilterTransactionServiceModel
import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.service.model.TransactionReplaceCategoryModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel

@Service
class TransactionServiceImpl(
    private val transactionRepository: TransactionRepository
) : TransactionService {
    @Transactional(propagation = Propagation.REQUIRED)
    override fun create(createModel: TransactionCreateModel): TransactionServiceModel {
        val createRow = createModel.toCreateRow()
        val transaction = transactionRepository.create(createRow)
        return transaction.toServiceModel()
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    override fun findAllByUserId(userId: UUID): List<TransactionServiceModel> {
        val entities = transactionRepository.findAll(userId)

        return entities.map { it.toServiceModel() }
    }

    @Transactional(propagation = Propagation.REQUIRED)
    override fun replaceCategoryWithNew(replaceCategoryModel: TransactionReplaceCategoryModel) {
        val replaceRow = replaceCategoryModel.toReplaceRow()

        transactionRepository.replaceCategory(replaceRow)
    }

    @Transactional(propagation = Propagation.REQUIRED)
    override fun filterTransaction(filterParams: FilterTransactionServiceModel): List<TransactionServiceModel> {
        val filterRow = filterParams.toFilterRow()
        val entities = transactionRepository.findFiltered(filterRow)

        return entities.map { it.toServiceModel() }
    }

    @Transactional(propagation = Propagation.REQUIRED)
    override fun deleteById(transactionId: UUID) {
        val existById = transactionRepository.existById(transactionId)

        if (!existById){
            throw RuntimeException("Не найдено транзакции с такой категорией $transactionId")
        }

        transactionRepository.deleteById(transactionId)
    }
}