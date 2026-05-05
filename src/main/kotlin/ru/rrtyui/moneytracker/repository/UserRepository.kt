package ru.rrtyui.moneytracker.repository

import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.api.dto.user.UserRegistrationRequestDto
import ru.rrtyui.moneytracker.entity.UserRole
import ru.rrtyui.moneytracker.entity.Users
import ru.rrtyui.moneytracker.mapper.toUser
import ru.rrtyui.moneytracker.service.data.UserData
import java.util.UUID

@Repository
class UserRepository {

    fun findUserByUserName(userName: String): UserData? = transaction {
        Users
            .selectAll()
            .where { Users.username eq userName }
            .map { it.toUser() }
            .singleOrNull()
    }

    fun insertNewUser(requestDto: UserRegistrationRequestDto, encodePassword: String) = transaction {
        Users.insert {
            it[username] = requestDto.username
            it[password] = encodePassword
            it[email] = requestDto.email
            it[role] = UserRole.USER
        }
    }

    fun existByUsername(username: String): Boolean = transaction {
        !Users
            .selectAll()
            .where { Users.username eq username }
            .empty()
    }

    fun findByUserId(userId: UUID): UserData? = transaction {
        Users
            .selectAll()
            .where { Users.id eq userId }
            .map { it.toUser() }
            .singleOrNull()
    }
}