package com.example.CRM1640.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;
import java.util.UUID;

public record RoleResponse(
        UUID id,
        String code,
        String name
) {}
