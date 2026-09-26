package ru.rrtyui.moneytracker.application.security.service

import ru.rrtyui.moneytracker.client.request.UserLoginRequest
import ru.rrtyui.moneytracker.client.request.UserRegistrationRequest
import ru.rrtyui.moneytracker.client.response.UserTokenResponse

interface SecurityService {
    fun loginUser(requestDto: UserLoginRequest): UserTokenResponse

    fun registerUser(requestDto: UserRegistrationRequest): String
}