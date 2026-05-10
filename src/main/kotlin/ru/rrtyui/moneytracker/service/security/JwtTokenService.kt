package ru.rrtyui.moneytracker.service.security

import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import ru.rrtyui.moneytracker.entity.UserRole
import ru.rrtyui.moneytracker.service.data.JwtClaimsData
import java.util.*
import javax.crypto.spec.SecretKeySpec

@Service
class JwtTokenService(
    @param:Value($$"${jwt.secret}") private val secret: String = ""
) {
    private val signingKey: SecretKeySpec
        get() {
            val keyBytes: ByteArray = Base64.getDecoder().decode(secret)
            return SecretKeySpec(keyBytes, 0, keyBytes.size, "HmacSHA256")
        }

    fun generateToken(subject: String, expiration: Date, additionalClaims: Map<String, Any> = emptyMap()): String = Jwts.builder()
        .setClaims(additionalClaims)
        .setSubject(subject)
        .setIssuedAt(Date(System.currentTimeMillis()))
        .setExpiration(expiration)
        .signWith(signingKey)
        .compact()

    fun extractClaims(token: String): JwtClaimsData {
        val claims = Jwts.parserBuilder()
            .setSigningKey(signingKey)
            .build()
            .parseClaimsJws(token)
            .body

        return JwtClaimsData(
            userId = UUID.fromString(claims.subject),
            username = claims["username"] as String,
            role = UserRole.valueOf(claims["role"] as String),
            type = claims["type"] as String
        )
    }
}