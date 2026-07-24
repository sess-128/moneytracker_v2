package ru.rrtyui.moneytracker.services.service

import ru.rrtyui.moneytracker.services.service.model.ActorPrincipal

interface ActorPrincipalService{
    fun getCurrentActor(): ActorPrincipal
}