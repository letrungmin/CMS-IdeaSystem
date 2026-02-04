package com.example.CRM1640.mappers;

import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.RoleResponse;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.entities.RoleEntity;
import com.example.CRM1640.entities.UserEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserEntity toEntity(UserRequest request) {
        if (request == null) return null;

        UserEntity entity = new UserEntity();
        entity.setEmail(request.email());
        entity.setUsername(request.username());
        entity.setFirstName(request.firstName());
        entity.setMiddleName(request.middleName());
        entity.setLastName(request.lastName());
        entity.setDob(request.dob());
        entity.setMobile(request.mobile());
        entity.setSocialLinks(request.socialLinks());
        entity.setAddress(request.address());

        return entity;
    }

    public UserResponse toResponse(UserEntity entity) {
        if (entity == null) return null;

        return new UserResponse(
                entity.getUuid(),
                entity.getEmail(),
                entity.getUsername(),
                entity.getFirstName(),
                entity.getMiddleName(),
                entity.getLastName(),
                entity.getDob(),
                entity.getMobile(),
                entity.getSocialLinks(),
                entity.getAddress(),
                mapRoles(entity.getRoles())
        );
    }

    private List<RoleResponse> mapRoles(Set<RoleEntity> roles) {
        if (roles == null || roles.isEmpty()) return List.of();

        return roles.stream()
                .map(role -> new RoleResponse(
                        role.getUuid(),
                        role.getName(),
                        role.getDescription()
                ))
                .collect(Collectors.toList());
    }
}
