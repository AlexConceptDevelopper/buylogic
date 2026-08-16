package com.buylogic.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final JwtProperties properties;

    public JwtUtil(JwtProperties properties) {
        this.properties = properties;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
            properties.secret().getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(
            Integer userId,
            String email,
            String role,
            Integer companyId) {

        return Jwts.builder()
            .subject(email)
            .claim("userId", userId)
            .claim("role", role)
            .claim("companyId", companyId)
            .issuedAt(new Date())
            .expiration(
                new Date(
                    System.currentTimeMillis()
                        + properties.expiration()
                )
            )
            .signWith(getSigningKey())
            .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    public Integer extractUserId(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .get("userId", Integer.class);
    }

    public String extractRole(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .get("role", String.class);
    }

    public Integer extractCompanyId(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .get("companyId", Integer.class);
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}