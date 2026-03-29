package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.AcademicYearRequest;
import com.example.CRM1640.dto.response.AcademicYearResponse;
import com.example.CRM1640.service.interfaces.AcademicYearService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/academic-years")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AcademicYearController {

    AcademicYearService service;

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
    @PostMapping
    public ApiResponse<AcademicYearResponse> create(
            @Valid @RequestBody AcademicYearRequest request,
            HttpServletRequest httpRequest
    ) {
        return success(service.create(request), httpRequest);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ApiResponse<AcademicYearResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AcademicYearRequest request,
            HttpServletRequest httpRequest
    ) {
        return success(service.update(id, request), httpRequest);
    }

    // ================= CHANGE ACTIVE =================
    @PatchMapping("/{id}")
    public ApiResponse<AcademicYearResponse> changeActiveStatus(
            @PathVariable Long id,
            @RequestParam boolean active,
            HttpServletRequest httpRequest
    ) {
        return success(service.changeActiveStatus(id, active), httpRequest);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        service.delete(id);
        return ApiResponse.<Void>builder()
                .message("Deleted successfully")
                .path(httpRequest.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public ApiResponse<AcademicYearResponse> getById(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        return success(service.getById(id), httpRequest);
    }

    // ================= GET ALL =================
    @GetMapping
    public ApiResponse<List<AcademicYearResponse>> getAll(
            HttpServletRequest httpRequest
    ) {
        return success(service.getAll(), httpRequest);
    }

    // ================= GET ACTIVE =================
    @GetMapping("/active")
    public ApiResponse<List<AcademicYearResponse>> getActiveYears(
            HttpServletRequest httpRequest
    ) {
        return success(service.getActiveYears(), httpRequest);
    }
}