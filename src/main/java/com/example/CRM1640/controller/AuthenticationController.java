package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.LoginRequest;
import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.UserResponseAdminRole;
import com.example.CRM1640.dto.response.AuthResponse;
import com.example.CRM1640.dto.response.UserResponseQAManagerRole;
import com.example.CRM1640.service.interfaces.AuthenticationService;
import com.example.CRM1640.service.interfaces.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;
    UserService userService;

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

    @GetMapping("/me")
    public ApiResponse<?> introspect() {
        return ApiResponse.builder()
                .message("Get current user successfully")
                .result(authenticationService.introspect())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    @PreAuthorize("hasAnyAuthority('ROLE_QA_MANAGER')")
    @GetMapping
    public ApiResponse<Page<UserResponseAdminRole>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest http
    ) {

        return ApiResponse.<Page<UserResponseAdminRole>>builder()
                .result(userService.getAllUsers(page, size))
                .message("Get all users successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    @PreAuthorize("hasAnyAuthority('ROLE_QA_MANAGER')")
    @GetMapping("/qa-manager/users")
    public ApiResponse<Page<UserResponseQAManagerRole>> getAllUsersForQA(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request
    ) {
        return ApiResponse.<Page<UserResponseQAManagerRole>>builder()
                .result(userService.getAllUsersForQAManager(page, size))
                .message("Get all users for QA Manager successfully")
                .path(request.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }
}