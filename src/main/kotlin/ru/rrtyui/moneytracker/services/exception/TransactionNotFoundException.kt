package ru.rrtyui.moneytracker.services.exception

class TransactionNotFoundException(override val message: String?) : Exception(message)