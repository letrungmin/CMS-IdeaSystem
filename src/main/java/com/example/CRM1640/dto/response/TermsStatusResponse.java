package com.example.CRM1640.dto.response;

public record TermsStatusResponse(
        boolean accepted,
        Long termsId,
        String version
) {}
