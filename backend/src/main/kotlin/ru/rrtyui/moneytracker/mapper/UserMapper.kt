package ru.rrtyui.moneytracker.mapper

import org.jetbrains.exposed.v1.core.ResultRow
import ru.rrtyui.moneytracker.entity.Users
import ru.rrtyui.moneytracker.service.data.UserData

fun ResultRow.toUser() = UserData (
    id = this[Users.id].value,
    username = this[Users.username],
    email = this[Users.email],
    password = this[Users.password],
    role = this[Users.role]
)
