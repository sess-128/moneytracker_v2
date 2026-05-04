package ru.rrtyui.moneytracker.service.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import java.util.Date
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

    fun extractUserId(token: String): UUID = UUID.fromString(extractAllClaims(token).subject)

    private fun extractAllClaims(token: String): Claims = Jwts.parserBuilder()
        .setSigningKey(signingKey)
        .build()
        .parseClaimsJws(token)
        .body

    fun validateToken(token: String, userId: UUID): Boolean = extractUserId(token) == userId && !isExpire(token)

    fun isExpire(token: String): Boolean = extractAllClaims(token).expiration.before(Date())
}