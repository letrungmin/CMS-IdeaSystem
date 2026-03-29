package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.LoginRequest;
import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.AuthResponse;
import com.example.CRM1640.service.interfaces.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    // ================= REGISTER =================
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> registerUser(
            @RequestPart("data") @Valid UserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        return ApiResponse.builder()
                .message("Register successfully")
                .result(authenticationService.save(request, avatar))
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .message("Login successfully")
                .result(authenticationService.login(request))
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= REFRESH =================
    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@RequestParam String refreshToken) {
        return ApiResponse.<AuthResponse>builder()
                .message("Refresh token successfully")
                .result(authenticationService.refresh(refreshToken))
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestParam String refreshToken) {
        authenticationService.logout(refreshToken);

        return ApiResponse.<Void>builder()
                .message("Logout successfully")
                .timestamp(System.currentTimeMillis())
                .build();
    }
}