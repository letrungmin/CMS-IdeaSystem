package com.example.CRM1640.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        Claims claims = jwtService.extractAllClaims(token);

        String username = claims.getSubject();
        Long departmentId = claims.get("department_id", Long.class);

        List<String> roles = claims.get("roles", List.class);
        List<String> permissions = claims.get("permissions", List.class);

        List<GrantedAuthority> authorities = new ArrayList<>();

        roles.forEach(r -> authorities.add(new SimpleGrantedAuthority(r)));
        permissions.forEach(p -> authorities.add(new SimpleGrantedAuthority(p)));

        CustomUserPrincipal principal = new CustomUserPrincipal(
                null,
                username,
                null,
                departmentId,
                authorities
        );

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}
