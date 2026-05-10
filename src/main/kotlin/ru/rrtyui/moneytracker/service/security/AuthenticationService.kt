package ru.rrtyui.moneytracker.service.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.user.UserLoginRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserTokenResponseDto
import ru.rrtyui.moneytracker.repository.UserRepository
import ru.rrtyui.moneytracker.service.data.UserPrincipal
import java.util.*

@Service
class AuthenticationService(
    private val authManager: AuthenticationManager,
    private val userRepository: UserRepository,
    private val jwtTokenService : JwtTokenService,
    @param:Value($$"${jwt.accessTokenExpiration}") private val accessTokenExpiration: Long = 0,
) {
     fun authentication(requestDto: UserLoginRequestDto): UserTokenResponseDto {
         val authenticate = authManager.authenticate(
             UsernamePasswordAuthenticationToken(
                 requestDto.username,
                 requestDto.password
             )
         )
         val principal = authenticate.principal as UserPrincipal
         val accessToken = createAccessToken(principal)
         return UserTokenResponseDto(token = accessToken)
    }

    private fun createAccessToken(user: UserPrincipal): String =
        jwtTokenService.generateToken(
            subject = user.id.toString(),
            expiration = Date(System.currentTimeMillis() + accessTokenExpiration),
            additionalClaims = mapOf(
                "username" to user.username,
                "role" to user.role.name,
                "type" to "access"
            )
        )
}