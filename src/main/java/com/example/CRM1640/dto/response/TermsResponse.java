package com.example.CRM1640.dto.response;

import com.example.CRM1640.enums.TermsStatus;

import java.time.LocalDateTime;

public record TermsResponse(

        Long id,

        String title,

        String content,

        String version,

        boolean active,

        TermsStatus status,

        Long departmentId,
        String departmentName,

        Long academicYearId,
        String academicYearName,

        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {}
