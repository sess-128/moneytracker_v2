package ru.rrtyui.moneytracker.service

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.user.UserLoginRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserLoginResponseDto
import ru.rrtyui.moneytracker.api.dto.user.UserRegistrationRequestDto
import ru.rrtyui.moneytracker.dao.repos.UserRepository
import ru.rrtyui.moneytracker.service.security.AuthenticationService

@Service
class SecurityService(
    private val authenticationService: AuthenticationService,
    private val passwordEncoder: PasswordEncoder,
    private val userRepository: UserRepository
) {
    fun loginUser(requestDto: UserLoginRequestDto): UserLoginResponseDto {
        return authenticationService.authentication(requestDto)
    }

    fun registerUser(requestDto: UserRegistrationRequestDto)  {
        if (userRepository.findUserByUserName(requestDto.username) != null) {
            throw IllegalArgumentException("Username ${requestDto.username} already exists")
        }
        val encodePassword = passwordEncoder.encode(requestDto.password)
        userRepository.insertAndReturnId(requestDto, encodePassword)
    }
}