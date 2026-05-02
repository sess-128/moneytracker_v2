package ru.rrtyui.moneytracker.dao


import org.jetbrains.exposed.v1.core.dao.id.IdTable


object TransactionTable : IdTable<Long>("transaction") {
    override val id = long("user_id").entityId()
    val name = varchar("transaction_description", 255)
}