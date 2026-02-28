package com.example.CRM1640.dto.response;

import com.example.CRM1640.entities.auth.UserEntity;

public record DepartmentResponse(
        Long id,
        String name,
        UserResponse qaName
) {
}
