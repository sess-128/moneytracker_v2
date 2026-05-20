package ru.rrtyui.moneytracker.services.persistence.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.services.security.data.UserData
import ru.rrtyui.moneytracker.services.persistence.tables.UsersTable

fun ResultRow.toUser() = UserData (
    id = this[UsersTable.id].value,
    username = this[UsersTable.username],
    email = this[UsersTable.email],
    password = this[UsersTable.password],
    role = this[UsersTable.role]
)
