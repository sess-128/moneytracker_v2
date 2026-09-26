package ru.rrtyui.moneytracker.services.service.mapper

import ru.rrtyui.moneytracker.application.security.data.UserPrincipal
import ru.rrtyui.moneytracker.services.service.model.ActorPrincipal

object UtilsMapper {
    fun UserPrincipal.toUseCase() =
        ActorPrincipal(
            id = this.id,
            username = this.username,
        )
}