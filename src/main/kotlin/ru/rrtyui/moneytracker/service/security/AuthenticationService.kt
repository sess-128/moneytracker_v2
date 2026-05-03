package ru.rrtyui.moneytracker.service.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.api.dto.user.UserLoginRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserLoginResponseDto
import ru.rrtyui.moneytracker.service.security.data.UserData
import java.util.Date

@Service
class AuthenticationService(
    private val authManager: AuthenticationManager,
    private val securityUserDetailsService: SecurityUserDetailsService,
    private val jwtTokenService : JwtTokenService,
    @param:Value("\${jwt.accessTokenExpiration}") private val accessTokenExpiration: Long = 0,
) {
     fun authentication(requestDto: UserLoginRequestDto): UserLoginResponseDto {
         val user = securityUserDetailsService.loadUserByUsername(requestDto.username)
        authManager.authenticate(
            UsernamePasswordAuthenticationToken(
                requestDto.username,
                requestDto.password
            )
        )
        val accessToken = createAccessToken(user)
        return UserLoginResponseDto(
            login = requestDto.username,
            token = accessToken
        )
    }

    private fun createAccessToken(user: SecurityUserDetails): String = jwtTokenService.generateToken(
        subject = user.username,
        expiration = Date(System.currentTimeMillis() + accessTokenExpiration)
    )
}