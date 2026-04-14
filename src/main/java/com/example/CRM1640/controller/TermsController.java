package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.TermsRequest;
import com.example.CRM1640.dto.response.TermsResponse;
import com.example.CRM1640.service.interfaces.TermService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/terms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TermsController {

    TermService termService;

    // ================= HELPER =================
    private <T> ApiResponse<T> success(T data, HttpServletRequest request) {
        return ApiResponse.<T>builder()
                .result(data)
                .message("Success")
                .path(request.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= CREATE =================
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ApiResponse<TermsResponse> create(
            @Valid @RequestBody TermsRequest request,
            HttpServletRequest http
    ) {
        return success(termService.create(request), http);
    }

    // ================= UPDATE =================
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<TermsResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TermsRequest request,
            HttpServletRequest http
    ) {
        return success(termService.update(id, request), http);
    }

    // ================= PUBLISH =================
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping("/publish/{id}")
    public ApiResponse<TermsResponse> publish(
            @PathVariable Long id,
            HttpServletRequest http
    ) {
        return success(termService.publish(id), http);
    }

    // ================= GET BY ACADEMIC YEAR =================
    @GetMapping("/academic-year/{academicYearId}")
    public ApiResponse<List<TermsResponse>> getByAcademicYear(
            @PathVariable Long academicYearId,
            HttpServletRequest http
    ) {
        return success(termService.getByAcademicYear(academicYearId), http);
    }
}