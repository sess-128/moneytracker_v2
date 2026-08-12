package ru.rrtyui.moneytracker.application.security.service.impl

import java.util.Date
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.application.jwt.JwtTokenService
import ru.rrtyui.moneytracker.application.security.data.UserPrincipal
import ru.rrtyui.moneytracker.application.security.service.AuthenticationService
import ru.rrtyui.moneytracker.client.request.UserLoginRequest
import ru.rrtyui.moneytracker.client.response.UserTokenResponse

@Service
class AuthenticationServiceImpl(
    private val authManager: AuthenticationManager,
    private val jwtTokenService : JwtTokenService,
    @param:Value($$"${jwt.accessTokenExpiration}") private val accessTokenExpiration: Long = 0,
): AuthenticationService {
     override fun authentication(requestDto: UserLoginRequest): UserTokenResponse {
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