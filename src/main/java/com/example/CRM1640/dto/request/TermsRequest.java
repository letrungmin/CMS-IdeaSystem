package com.example.CRM1640.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TermsRequest(

        @NotBlank(message = "Title must not be blank")
        String title,

        @NotBlank(message = "Content must not be blank")
        String content,

        @NotBlank(message = "Version must not be blank")
        String version,

        @NotNull(message = "Department is required")
        Long departmentId,

        @NotNull(message = "Academic year is required")
        Long academicYearId

) {}
