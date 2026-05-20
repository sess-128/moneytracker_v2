package ru.rrtyui.moneytracker.service.security

import io.jsonwebtoken.JwtException
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Service
import org.springframework.web.filter.OncePerRequestFilter
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@Service
class JwtAccessFilter(
    private val jwtTokenService: JwtTokenService,

) : OncePerRequestFilter() {
    companion object {
        private const val BEARER_PREFIX = "Bearer "
        private const val AUTHORIZATION_HEADER = "Authorization"
        private const val TOKEN_TYPE_ACCESS = "access"
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authorizationHeader = request.getHeader(AUTHORIZATION_HEADER)
        if (authorizationHeader.isNullOrBlank() || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response)
            return
        }

        try {
            val token = authorizationHeader.substringAfter(BEARER_PREFIX)
            val jwtClaimsData = jwtTokenService.extractClaims(token)


            if (jwtClaimsData.type != TOKEN_TYPE_ACCESS) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED)
                return
            }

            if (SecurityContextHolder.getContext().authentication == null) {
                val principal = UserPrincipal(
                    id = jwtClaimsData.userId,
                    username = jwtClaimsData.username,
                    role = jwtClaimsData.role
                )

                val authToken = UsernamePasswordAuthenticationToken(
                    principal,
                    null,
                    listOf(principal.role)
                )
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authToken
            }
        } catch (ex: JwtException) {
            SecurityContextHolder.clearContext()
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED)
            return
        }

        filterChain.doFilter(request, response)
    }
}