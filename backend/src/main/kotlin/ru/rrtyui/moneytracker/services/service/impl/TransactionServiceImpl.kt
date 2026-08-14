package ru.rrtyui.moneytracker.services.service.impl

import java.util.UUID
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.services.persistence.repository.TransactionRepository
import ru.rrtyui.moneytracker.services.service.TransactionService
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toCreateRow
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toReplaceRow
import ru.rrtyui.moneytracker.services.service.mapper.TransactionServiceMapper.toServiceModel
import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.service.model.TransactionReplaceCategoryModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel

@Service
class TransactionServiceImpl(
    private val transactionRepository: TransactionRepository
): TransactionService {
    override fun create(createModel: TransactionCreateModel): TransactionServiceModel {
        val createRow = createModel.toCreateRow()
        val transaction = transactionRepository.create(createRow)
        return transaction.toServiceModel()
    }

    override fun findAllByUserId(userId: UUID): List<TransactionServiceModel> {
        val entities = transactionRepository.findAll(userId)

        return entities.map { it.toServiceModel() }
    }

    override fun replaceCategoryWithNew(replaceCategoryModel: TransactionReplaceCategoryModel) {
        val replaceRow = replaceCategoryModel.toReplaceRow()

        transactionRepository.replaceCategory(replaceRow)
    }
}