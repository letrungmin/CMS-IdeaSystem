package com.example.CRM1640.mappers;

import com.example.CRM1640.config.CustomUserPrincipal;
import com.example.CRM1640.entities.auth.UserEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;

public class UserMapperUtil {

    public static CustomUserPrincipal toPrincipal(UserEntity user) {

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));

            role.getPermissions().forEach(p ->
                    authorities.add(new SimpleGrantedAuthority(p.getName()))
            );
        });

        return new CustomUserPrincipal(
                user.getId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getDepartment().getId(),
                authorities
        );
    }
}
