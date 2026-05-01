package ru.rrtyui.moneytracker.service.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Service
import org.springframework.web.filter.OncePerRequestFilter
import ru.rrtyui.moneytracker.repository.UserRepository
import ru.rrtyui.moneytracker.exception.UserNotFoundException
import ru.rrtyui.moneytracker.service.security.data.UserData
import java.util.UUID

@Service
class JwtAccessFilter(
    private val jwtTokenService: JwtTokenService,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authorizationHeader: String? = request.getHeader("Authorization")
        if (authorizationHeader.isNullOrBlank() || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }
        runCatching {
            val token: String = authorizationHeader.substringAfter("Bearer ")
            val userId: UUID = jwtTokenService.extractUserId(token)
            if (SecurityContextHolder.getContext().authentication == null) {
                val user: UserData = userRepository.findByUserId(userId) ?: let { throw UserNotFoundException("User not found") }
                if (userId == user.id) {
                    val authToken = UsernamePasswordAuthenticationToken(
                        user, null, listOf(user.role)
                    )
                    authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                    SecurityContextHolder.getContext().authentication = authToken
                }
            }
            filterChain.doFilter(request, response)
        }.onFailure { ex ->
            response.writer.write(
                """
            {
              "error": "${ex.message ?: "unknown error"}"
            }
            """.trimIndent()
            )
        }
    }
}