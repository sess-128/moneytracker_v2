package ru.rrtyui.moneytracker.client.api.v1

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.client.RestConstants.API_V1
import ru.rrtyui.moneytracker.client.RestConstants.USERS_URL
import ru.rrtyui.moneytracker.client.request.UserLoginRequest
import ru.rrtyui.moneytracker.client.request.UserRegistrationRequest
import ru.rrtyui.moneytracker.client.response.UserInfoResponse
import ru.rrtyui.moneytracker.client.response.UserTokenResponse
import ru.rrtyui.moneytracker.services.security.data.UserPrincipal
import ru.rrtyui.moneytracker.services.service.SecurityService

@RestController
@RequestMapping("$API_V1/$USERS_URL")
@Tag(name = "Аутентификация", description = "API для аутентификации пользователей")
class UserAuthenticationController(
    val securityService : SecurityService
) {

    @PostMapping("/login")
    @Operation(summary = "Вход в систему", description = "Возвращает JWT токен при успешной аутентификации")
    fun loginUser(
        @RequestBody requestDto: UserLoginRequest
    ) : ResponseEntity<UserTokenResponse> =
        ok(securityService.loginUser(requestDto))


    @PostMapping("/registration")
    @Operation(summary = "Регистрация", description = "Возвращает имя успешно зарегистрированного пользователя")
    fun registerUser(
        @RequestBody requestDto: UserRegistrationRequest
    ): ResponseEntity<String> =
        ok(securityService.registerUser(requestDto))


    @GetMapping("/me")
    @Operation(summary = "Кто я?", description = "Возвращает данные о текущем пользователе")
    fun getMe(
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<UserInfoResponse> =
        ok(UserInfoResponse(principal.id.toString(), principal.username))
}