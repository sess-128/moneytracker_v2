package ru.rrtyui.moneytracker.service.security

import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.dao.repos.UserRepository
import ru.rrtyui.moneytracker.service.security.data.UserData
import java.nio.file.attribute.UserPrincipalNotFoundException

@Service
class SecurityUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): SecurityUserDetails {
        val found = userRepository.findUserByUserName(username)
            ?: throw UserPrincipalNotFoundException("User $username not found")
        return SecurityUserDetails(found)
    }
}