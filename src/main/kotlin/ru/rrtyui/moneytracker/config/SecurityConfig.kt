package ru.rrtyui.moneytracker.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import ru.rrtyui.moneytracker.dao.repos.UserRepository
import ru.rrtyui.moneytracker.service.security.JwtAccessFilter
import ru.rrtyui.moneytracker.service.security.SecurityUserDetailsService


@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun userDetailsService(userRepository: UserRepository): SecurityUserDetailsService =
        SecurityUserDetailsService(userRepository)

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager =
        config.authenticationManager

    @Bean
    fun daoAuthenticationProvider(userRepository: UserRepository): DaoAuthenticationProvider {
        val daoAuthenticationProvider = DaoAuthenticationProvider(userDetailsService(userRepository))
        daoAuthenticationProvider.setPasswordEncoder(encoder())
        return daoAuthenticationProvider
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity, jwtAccessFilter: JwtAccessFilter, userRepository: UserRepository): DefaultSecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests {
                it
                    .requestMatchers( "/api/users/**")
                    .permitAll()
                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/task-tracker-swagger-ui**")
                    .permitAll()
                    .anyRequest()
                    .fullyAuthenticated()
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .addFilterBefore(jwtAccessFilter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }

    @Bean
    fun encoder(): PasswordEncoder = BCryptPasswordEncoder()
}