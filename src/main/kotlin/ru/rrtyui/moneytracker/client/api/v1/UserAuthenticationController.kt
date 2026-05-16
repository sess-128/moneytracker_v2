package ru.rrtyui.moneytracker.client.api.v1

import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rrtyui.moneytracker.client.RestConstants.API_V1
import ru.rrtyui.moneytracker.client.RestConstants.CATEGORIES_URL
import ru.rrtyui.moneytracker.client.request.UserLoginRequest
import ru.rrtyui.moneytracker.client.request.UserRegistrationRequest
import ru.rrtyui.moneytracker.client.response.UserInfoResponse
import ru.rrtyui.moneytracker.client.response.UserTokenResponse
import ru.rrtyui.moneytracker.service.SecurityService
import ru.rrtyui.moneytracker.service.data.UserPrincipal

@RestController
@RequestMapping("$API_V1/$CATEGORIES_URL")
class UserAuthenticationController(
    val securityService : SecurityService
) {

    @PostMapping("/login")
    fun loginUser(@RequestBody requestDto: UserLoginRequest) : ResponseEntity<UserTokenResponse> =
        ok(securityService.loginUser(requestDto))


    @PostMapping("/registration")
    fun registerUser(@RequestBody requestDto: UserRegistrationRequest): ResponseEntity<String> =
        ok(securityService.registerUser(requestDto))


    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal principal: UserPrincipal): ResponseEntity<UserInfoResponse> =
        ok(UserInfoResponse(principal.id.toString(), principal.username))
}