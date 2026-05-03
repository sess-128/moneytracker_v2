package ru.rrtyui.moneytracker.mapper

import org.jetbrains.exposed.sql.ResultRow
import ru.rrtyui.moneytracker.dao.Users
import ru.rrtyui.moneytracker.service.security.data.UserData

fun ResultRow.toUser() = UserData (
    id = this[Users.id].value,
    username = this[Users.username],
    email = this[Users.email],
    password = this[Users.password],
    role = this[Users.role]
)
