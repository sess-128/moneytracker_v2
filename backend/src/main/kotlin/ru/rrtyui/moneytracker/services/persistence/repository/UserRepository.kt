package ru.rrtyui.moneytracker.services.persistence.repository

import java.util.UUID
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.client.request.UserRegistrationRequest
import ru.rrtyui.moneytracker.services.persistence.tables.UserRole
import ru.rrtyui.moneytracker.services.persistence.tables.UsersTable
import ru.rrtyui.moneytracker.services.persistence.mapper.toUser
import ru.rrtyui.moneytracker.services.security.data.UserData

@Repository
class UserRepository {

    fun findUserByUserName(userName: String): UserData? = transaction {
        UsersTable
            .selectAll()
            .where { UsersTable.username eq userName }
            .map { it.toUser() }
            .singleOrNull()
    }

    fun insertNewUser(requestDto: UserRegistrationRequest, encodePassword: String) = transaction {
        UsersTable.insert {
            it[username] = requestDto.username
            it[password] = encodePassword
            it[email] = requestDto.email
            it[role] = UserRole.USER
        }
    }

    fun existByUsername(username: String): Boolean = transaction {
        !UsersTable
            .selectAll()
            .where { UsersTable.username eq username }
            .empty()
    }

    fun findByUserId(userId: UUID): UserData? = transaction {
        UsersTable
            .selectAll()
            .where { UsersTable.id eq userId }
            .map { it.toUser() }
            .singleOrNull()
    }
}