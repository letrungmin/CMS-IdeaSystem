package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.service.interfaces.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ApiResponse<?> getAll() {
        return ApiResponse.builder()
                .result(roleService.getAll())
                .build();
    }
}
