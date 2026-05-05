package ru.rrtyui.moneytracker.service.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.user.UserLoginRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserTokenResponseDto
import ru.rrtyui.moneytracker.repository.UserRepository
import ru.rrtyui.moneytracker.exception.UserNotFoundException
import ru.rrtyui.moneytracker.service.data.UserData
import java.util.Date

@Service
class AuthenticationService(
    private val authManager: AuthenticationManager,
    private val userRepository: UserRepository,
    private val jwtTokenService : JwtTokenService,
    @param:Value($$"${jwt.accessTokenExpiration}") private val accessTokenExpiration: Long = 0,
) {
     fun authentication(requestDto: UserLoginRequestDto): UserTokenResponseDto {
         authManager.authenticate(
             UsernamePasswordAuthenticationToken(
                 requestDto.username,
                 requestDto.password
             )
         )
         val user: UserData = userRepository.findUserByUserName(requestDto.username)
             ?: let { throw UserNotFoundException("User not found") }
         val accessToken = createAccessToken(user)
         return UserTokenResponseDto(token = accessToken)
    }

    private fun createAccessToken(user: UserData): String = jwtTokenService.generateToken(
        subject = user.id.toString(),
        expiration = Date(System.currentTimeMillis() + accessTokenExpiration)
    )
}