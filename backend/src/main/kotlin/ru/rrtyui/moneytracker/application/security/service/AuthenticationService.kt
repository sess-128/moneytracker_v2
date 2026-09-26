package ru.rrtyui.moneytracker.application.security.service

import ru.rrtyui.moneytracker.client.request.UserLoginRequest
import ru.rrtyui.moneytracker.client.response.UserTokenResponse

interface AuthenticationService {
    fun authentication(requestDto: UserLoginRequest): UserTokenResponse
}