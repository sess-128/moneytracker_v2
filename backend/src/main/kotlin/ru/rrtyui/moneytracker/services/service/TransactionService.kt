package ru.rrtyui.moneytracker.services.service

import ru.rrtyui.moneytracker.services.service.model.TransactionCreateModel
import ru.rrtyui.moneytracker.services.service.model.TransactionServiceModel

interface TransactionService {
    fun create(createModel: TransactionCreateModel): TransactionServiceModel
}