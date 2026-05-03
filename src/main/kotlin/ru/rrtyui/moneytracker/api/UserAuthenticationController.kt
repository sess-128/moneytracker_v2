package ru.rrtyui.moneytracker.api

import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.*
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.api.dto.user.UserLoginRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserLoginResponseDto
import ru.rrtyui.moneytracker.api.dto.user.UserRegistrationRequestDto
import ru.rrtyui.moneytracker.service.SecurityService
import ru.rrtyui.moneytracker.service.security.SecurityUserDetails

@RequestMapping("/api/users")
@RestController
class UserAuthenticationController(
    val securityService : SecurityService
) {
    @PostMapping("/login")
    fun loginUser(
        @RequestBody requestDto: UserLoginRequestDto
    ) : ResponseEntity<UserLoginResponseDto> {
        return ok(
            securityService.loginUser(requestDto)
        )
    }

    @PostMapping("/registration")
    fun registerUser(
        @RequestBody requestDto: UserRegistrationRequestDto
    ) : ResponseEntity<String> {
        securityService.registerUser(requestDto)
        return ok("successful registration")
    }

    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal principal: SecurityUserDetails): ResponseEntity<UserLoginResponseDto> {
        return ok(
            UserLoginResponseDto(principal.username, "null")
        )
    }
}