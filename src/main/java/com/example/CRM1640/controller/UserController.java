package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.AcceptTermsRequest;
import com.example.CRM1640.dto.response.TermsStatusResponse;
import com.example.CRM1640.service.interfaces.TermService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    TermService service;

    // ================= GET TERMS STATUS =================
    @GetMapping("/me/terms-status")
    public ApiResponse<TermsStatusResponse> getMyTermsStatus(HttpServletRequest http) {

        return ApiResponse.<TermsStatusResponse>builder()
                .result(service.getMyTermsStatus())
                .message("Get terms status successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= ACCEPT TERMS =================
    @PostMapping("/accept-terms")
    public ApiResponse<Void> acceptTerms(
            @RequestBody AcceptTermsRequest request,
            HttpServletRequest http
    ) {

        service.acceptTerms(request);

        return ApiResponse.<Void>builder()
                .message("Accept terms successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }


}