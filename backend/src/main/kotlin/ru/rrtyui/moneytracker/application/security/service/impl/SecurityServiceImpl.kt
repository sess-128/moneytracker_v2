package ru.rrtyui.moneytracker.application.security.service.impl

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.application.security.service.AuthenticationService
import ru.rrtyui.moneytracker.application.security.service.SecurityService
import ru.rrtyui.moneytracker.client.request.UserLoginRequest
import ru.rrtyui.moneytracker.client.request.UserRegistrationRequest
import ru.rrtyui.moneytracker.client.response.UserTokenResponse
import ru.rrtyui.moneytracker.services.exception.UserAlreadyExistsException
import ru.rrtyui.moneytracker.services.persistence.repository.UserRepository

@Service
class SecurityServiceImpl(
    private val authenticationService: AuthenticationService,
    private val passwordEncoder: PasswordEncoder,
    private val userRepository: UserRepository,
    private val successUserRegistrationMessage : String = "Successful registration user with username: %s"
): SecurityService {
    override fun loginUser(requestDto: UserLoginRequest):
            UserTokenResponse = authenticationService.authentication(requestDto)


    override fun registerUser(requestDto: UserRegistrationRequest) : String {
        userRepository.existByUsername(requestDto.username)
            .takeIf { it }
            ?.let { throw UserAlreadyExistsException("User already exists") }
        val encodePassword = passwordEncoder.encode(requestDto.password)
        userRepository.insertNewUser(requestDto, encodePassword)
        return successUserRegistrationMessage.replace("%s", requestDto.username)
    }
}