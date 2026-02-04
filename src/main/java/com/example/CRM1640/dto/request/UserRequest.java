package com.example.CRM1640.dto.request;

import jakarta.validation.constraints.*;
import lombok.Builder;
import java.time.LocalDate;
import java.util.List;

@Builder
public record UserRequest (
        @Email
        @NotBlank
        String email,

        @NotBlank
        @Size(min = 4, max = 50)
        String username,

        @NotBlank
        String firstName,

        String middleName,

        @NotBlank
        String lastName,

        @NotBlank
        @Size(min = 8)
        String password,

        @NotNull
        LocalDate dob,

        @Pattern(regexp = "^[0-9]{9,12}$")
        @NotNull
        String mobile,

        String socialLinks,

        @NotBlank
        String address,

        List<Long> roles
){}
