package com.example.CRM1640.dto.request;

import jakarta.validation.constraints.NotBlank;


public record LoginRequest(String username, String password) {}
