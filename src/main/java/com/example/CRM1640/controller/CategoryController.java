package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.CategoryRequest;
import com.example.CRM1640.dto.response.CategoryResponse;
import com.example.CRM1640.service.interfaces.CategoryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ================= CREATE =================
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ApiResponse<CategoryResponse> create(
            @RequestBody CategoryRequest request,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.create(request))
                .message("Category created successfully")
                .path(httpRequest.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= UPDATE =================
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> update(
            @PathVariable Long id,
            @RequestBody CategoryRequest request,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.update(id, request))
                .message("Category updated successfully")
                .path(httpRequest.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= DELETE =================
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        categoryService.delete(id);

        return ApiResponse.<Void>builder()
                .message("Category deleted successfully")
                .path(httpRequest.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getById(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getById(id))
                .message("Get category successfully")
                .path(httpRequest.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= GET ALL =================
    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll(HttpServletRequest httpRequest) {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAll())
                .message("Get all categories successfully")
                .path(httpRequest.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= GET ACTIVE =================
    @GetMapping("/active")
    public ApiResponse<List<CategoryResponse>> getActive(HttpServletRequest httpRequest) {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getActive())
                .message("Get active categories successfully")
                .path(httpRequest.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }
}