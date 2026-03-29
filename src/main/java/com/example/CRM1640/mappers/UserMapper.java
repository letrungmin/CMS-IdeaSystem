package com.example.CRM1640.mappers;

import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.DepartmentResponse;
import com.example.CRM1640.dto.response.RoleResponse;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.entities.auth.RoleEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserMapper {
    DepartmentMapper departmentMapper;
    public UserEntity toEntity(UserRequest request) {

        UserEntity user = new UserEntity();

        user.setEmail(request.email());
        user.setUsername(request.username());
        user.setFirstName(request.firstName());
        user.setMiddleName(request.middleName());
        user.setLastName(request.lastName());
        user.setDob(request.dob());
        user.setMobile(request.mobile());
        user.setSocialLinks(request.socialLinks());
        user.setAddress(request.address());
        user.setLocation(request.location());

        return user;
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
                entity.getJoinDate(),
                entity.getLocation(),
                entity.getLocation() != null
                        ? entity.getLocation().getDisplayName()
                        : null,
                entity.getAvatarUrl(),

                mapRoles(entity.getRoles()),
                departmentMapper.toResponse(entity.getDepartment())
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
