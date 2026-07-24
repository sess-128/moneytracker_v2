package ru.rrtyui.moneytracker.services.service.impl

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.application.security.data.UserPrincipal
import ru.rrtyui.moneytracker.services.exception.UnauthorizedException
import ru.rrtyui.moneytracker.services.service.ActorPrincipalService
import ru.rrtyui.moneytracker.services.service.mapper.UtilsMapper.toUseCase
import ru.rrtyui.moneytracker.services.service.model.ActorPrincipal

@Service
class ActorPrincipalServiceImpl: ActorPrincipalService {
    override fun getCurrentActor(): ActorPrincipal {
        val principal = SecurityContextHolder.getContext().authentication?.principal as? UserPrincipal
        return principal?.toUseCase()
            ?: throw UnauthorizedException("Not authenticated")
    }
}