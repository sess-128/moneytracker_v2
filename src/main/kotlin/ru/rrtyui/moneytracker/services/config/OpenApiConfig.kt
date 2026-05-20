package ru.rrtyui.moneytracker.services.config

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.security.SecurityScheme
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.License
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@SecurityScheme(
    name = OpenApiConfig.SECURITY_SCHEME_NAME,
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer",
    description = "Введите JWT токен, полученный после успешной аутентификации."
)
class OpenApiConfig {

    companion object {
        const val API_TITLE = "MoneyTracker API"
        const val API_VERSION = "1.0.0"
        const val SECURITY_SCHEME_NAME = "Bearer Authentication"

        const val LICENSE_NAME = "MIT License"
        const val LICENSE_URL = "https://opensource.org/licenses/MIT"

        val API_DESCRIPTION = """
            # 🚀 Добро пожаловать в MoneyTracker API
            
            Это RESTful API для сервиса учета личных финансов. 
            Система позволяет эффективно управлять доходами, расходами, категориями и аналитикой.
            
            ## ✨ Основные возможности:
            - **Учет транзакций:** Быстрое добавление доходов и расходов с детализацией.
            - **Категоризация:** Гибкая система категорий и подкатегорий (поддержка иерархии).
            - **Аналитика:** Получение статистики по периодам, типам операций и категориям.
            - **Безопасность:** JWT-аутентификация для защиты пользовательских данных.
            
            ## 🛠 Технологический стек:
            Kotlin, Spring Boot, PostgreSQL, Exposed ORM, Liquibase.
            
            ---
            *Для авторизации используйте схему **$SECURITY_SCHEME_NAME** (JWT токен).*
        """.trimIndent()
    }

    @Bean
    fun customOpenAPI(): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title(API_TITLE)
                    .version(API_VERSION)
                    .description(API_DESCRIPTION)
                    .license(
                        License()
                            .name(LICENSE_NAME)
                            .url(LICENSE_URL)
                    )
            )
    }
}