package ru.rrtyui.moneytracker.service.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.util.UUID
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Service
import org.springframework.web.filter.OncePerRequestFilter
import ru.rrtyui.moneytracker.exception.UserNotFoundException
import ru.rrtyui.moneytracker.repository.UserRepository

@Service
class JwtAccessFilter(
    private val jwtTokenService: JwtTokenService,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
        val authorizationHeader = request.getHeader("Authorization")
        if (authorizationHeader.isNullOrBlank() || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }
        val token = authorizationHeader.substringAfter("Bearer ")
        val userId: UUID = jwtTokenService.extractUserId(token)
        if (SecurityContextHolder.getContext().authentication == null) {
            val user = userRepository.findByUserId(userId)
                ?: throw UserNotFoundException("User not found")
            val authToken = UsernamePasswordAuthenticationToken(
                user,
                null,
                listOf(user.role)
            )
            authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
            SecurityContextHolder.getContext().authentication = authToken
        }

        filterChain.doFilter(request, response)
    }
}