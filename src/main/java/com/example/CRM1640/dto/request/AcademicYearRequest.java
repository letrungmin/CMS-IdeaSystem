package com.example.CRM1640.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AcademicYearRequest(

        @NotBlank
        String name,

        @NotNull
        LocalDateTime ideaClosureDate,

        @NotNull
        LocalDateTime finalClosureDate,

        boolean active
) {}
