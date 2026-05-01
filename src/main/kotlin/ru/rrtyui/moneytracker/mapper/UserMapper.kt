package ru.rrtyui.moneytracker.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.entity.UserTable
import ru.rrtyui.moneytracker.service.security.data.UserData

fun ResultRow.toUser() = UserData (
    id = this[UserTable.id].value,
    username = this[UserTable.username],
    email = this[UserTable.email],
    password = this[UserTable.password],
    role = this[UserTable.role]
)
