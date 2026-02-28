package com.example.CRM1640.dto.response;

import java.time.LocalDateTime;

public record AcademicYearResponse(
        Long id,
        String name,
        LocalDateTime ideaClosureDate,
        LocalDateTime finalClosureDate,
        boolean active
) {}
