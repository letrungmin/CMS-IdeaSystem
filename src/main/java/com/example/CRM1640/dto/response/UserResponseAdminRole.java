package com.example.CRM1640.dto.response;

import java.util.List;

public record UserResponseAdminRole(
        Long id,
        String username,
        String email,
        String avatarUrl,
        String departmentName,
        List<String> roles
) {}
