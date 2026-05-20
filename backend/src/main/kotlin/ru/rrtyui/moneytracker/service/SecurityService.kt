package ru.rrtyui.moneytracker.service

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.user.UserLoginRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserRegistrationRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserTokenResponseDto
import ru.rrtyui.moneytracker.exception.UserAlreadyExistsException
import ru.rrtyui.moneytracker.repository.UserRepository
import ru.rrtyui.moneytracker.service.security.AuthenticationService

@Service
class SecurityService(
    private val authenticationService: AuthenticationService,
    private val passwordEncoder: PasswordEncoder,
    private val userRepository: UserRepository,
    private val successUserRegistrationMessage : String = "Successful registration user with username: %s"
) {
    fun loginUser(requestDto: UserLoginRequestDto):
            UserTokenResponseDto = authenticationService.authentication(requestDto)


    fun registerUser(requestDto: UserRegistrationRequestDto) : String {
        userRepository.existByUsername(requestDto.username)
            .takeIf { it }
            ?.let { throw UserAlreadyExistsException("User already exists") }
        val encodePassword = passwordEncoder.encode(requestDto.password)
        userRepository.insertNewUser(requestDto, encodePassword)
        return successUserRegistrationMessage.replace("%s", requestDto.username)
    }
}