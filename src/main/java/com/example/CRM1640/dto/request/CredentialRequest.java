package com.example.CRM1640.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CredentialRequest(

        @NotBlank
        String identifier,   // email or username

        @NotBlank
        String password

) {}
