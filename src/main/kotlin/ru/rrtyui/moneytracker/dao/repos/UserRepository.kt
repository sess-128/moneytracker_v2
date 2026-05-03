package ru.rrtyui.moneytracker.dao.repos

import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import ru.rrtyui.moneytracker.api.dto.user.UserLoginRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserRegistrationRequestDto
import ru.rrtyui.moneytracker.dao.UserRole
import ru.rrtyui.moneytracker.dao.Users
import ru.rrtyui.moneytracker.dao.Users.email
import ru.rrtyui.moneytracker.dao.Users.username
import ru.rrtyui.moneytracker.mapper.toUser
import ru.rrtyui.moneytracker.service.security.data.UserData
import java.nio.file.attribute.UserPrincipalNotFoundException
import java.util.UUID

@Repository
class UserRepository {

    fun findUserByUserName(userName: String): UserData? = transaction {
        Users
            .selectAll()
            .where { Users.username eq userName }
            .map { it.toUser() }
            .firstOrNull()
    }

    fun insertAndReturnId(requestDto: UserRegistrationRequestDto, encodePassword: String): UUID = transaction {
        Users.insertAndGetId() {
            it[username] = requestDto.username
            it[password] = encodePassword
            it[email] = requestDto.email
            it[role] = UserRole.USER
        } .value
    }

    fun findByUserId(createdUserID: UUID): UserData =  transaction {
        Users
            .selectAll()
            .where { Users.id eq createdUserID }
            .map { it.toUser() }
            .firstOrNull() ?: throw UserPrincipalNotFoundException("User with id: $createdUserID not found")
    }
}