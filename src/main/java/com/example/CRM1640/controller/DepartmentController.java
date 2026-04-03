package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.DepartmentRequest;
import com.example.CRM1640.service.interfaces.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ApiResponse<?> create(@RequestBody DepartmentRequest request) {
        return ApiResponse.builder()
                .result(departmentService.create(request))
                .build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<?> update(@PathVariable Long id,
                                 @RequestBody DepartmentRequest request) {
        return ApiResponse.builder()
                .result(departmentService.update(id, request))
                .build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {
        departmentService.delete(id);
        return ApiResponse.builder().result("Deleted").build();
    }


    @GetMapping("/{id}")
    public ApiResponse<?> getById(@PathVariable Long id) {
        return ApiResponse.builder()
                .result(departmentService.getById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<?> getAll() {
        return ApiResponse.builder()
                .result(departmentService.getAll())
                .build();
    }
}
