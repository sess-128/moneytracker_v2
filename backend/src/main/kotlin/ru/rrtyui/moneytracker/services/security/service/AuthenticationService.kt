package ru.rrtyui.moneytracker.services.security.service

import java.util.Date
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.client.request.UserLoginRequest
import ru.rrtyui.moneytracker.client.response.UserTokenResponse
import ru.rrtyui.moneytracker.services.jwt.JwtTokenService
import ru.rrtyui.moneytracker.services.security.data.UserPrincipal

@Service
class AuthenticationService(
    private val authManager: AuthenticationManager,
    private val jwtTokenService : JwtTokenService,
    @param:Value($$"${jwt.accessTokenExpiration}") private val accessTokenExpiration: Long = 0,
) {
     fun authentication(requestDto: UserLoginRequest): UserTokenResponse {
         val authenticate = authManager.authenticate(
             UsernamePasswordAuthenticationToken(
                 requestDto.username,
                 requestDto.password
             )
         )
         val principal = authenticate.principal as UserPrincipal
         val accessToken = createAccessToken(principal)
         return UserTokenResponse(token = accessToken)
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