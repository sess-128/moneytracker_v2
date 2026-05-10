package ru.rrtyui.moneytracker.api

import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import ru.rrtyui.moneytracker.api.dto.user.UserInfoResponseDto
import ru.rrtyui.moneytracker.api.dto.user.UserLoginRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserRegistrationRequestDto
import ru.rrtyui.moneytracker.api.dto.user.UserTokenResponseDto
import ru.rrtyui.moneytracker.service.SecurityService
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@RequestMapping("/api/users")
@RestController
class UserAuthenticationController(
    val securityService : SecurityService
) {
    @PostMapping("/login")
    fun loginUser(@RequestBody requestDto: UserLoginRequestDto) : ResponseEntity<UserTokenResponseDto> =
        ok(securityService.loginUser(requestDto))


    @PostMapping("/registration")
    fun registerUser(@RequestBody requestDto: UserRegistrationRequestDto): ResponseEntity<String> =
        ok(securityService.registerUser(requestDto))


    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal principal: UserPrincipal): ResponseEntity<UserInfoResponseDto> =
        ok(UserInfoResponseDto(principal.id.toString(), principal.username))
}