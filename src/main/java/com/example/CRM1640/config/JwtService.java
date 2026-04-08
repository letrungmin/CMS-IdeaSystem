package com.example.CRM1640.config;

import com.example.CRM1640.entities.auth.Permission;
import com.example.CRM1640.entities.auth.RoleEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class JwtService {

    private static final String SECRET = "mCVIgHEU1ht118lXtFSO0+o64l4NOzpAD0/H8PxAJEI=";

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ================= ACCESS TOKEN =================
    public String generateAccessToken(UserEntity user) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("department_id", user.getDepartment().getId());
        claims.put("username", user.getUsername());

        claims.put("roles",
                user.getRoles().stream()
                        .map(RoleEntity::getName)
                        .collect(Collectors.toList())
        );

        claims.put("permissions",
                user.getRoles().stream()
                        .flatMap(r -> r.getPermissions().stream())
                        .map(Permission::getName)
                        .distinct()
                        .collect(Collectors.toList())
        );

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 1555)) // 15 minute
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ================= REFRESH TOKEN =================
    public String generateRefreshToken(UserEntity user) {

        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7 days
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ================= PARSE TOKEN =================
    public Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ================= EXTRACT =================
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractDepartmentId(String token) {
        return extractAllClaims(token).get("department_id", Long.class);
    }

    // ================= VALIDATE =================
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}