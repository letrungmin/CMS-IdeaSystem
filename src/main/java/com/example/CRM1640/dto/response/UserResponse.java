package com.example.CRM1640.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserResponse(
        UUID uuid,
        String email,
        String username,
        String firstName,
        String middleName,
        String lastName,
        LocalDate dob,
        String mobile,
        String socialLinks,
        String address,

        List<RoleResponse> roles
) {}