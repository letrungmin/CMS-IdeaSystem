package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.CredentialRequest;
import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.service.interfaces.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping(
            value = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<?> registerUser(
            @RequestPart("data") @Valid UserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        return ApiResponse.builder()
                .message("Success")
                .result(authenticationService.save(request,avatar))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody CredentialRequest request) {
        return ApiResponse.builder()
                .message("Success")
                .result(authenticationService.login(request))
                .build();
    }
}