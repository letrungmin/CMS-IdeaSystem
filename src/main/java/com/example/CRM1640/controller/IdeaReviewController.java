package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.RejectRequest;
import com.example.CRM1640.service.interfaces.IdeaService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ideas/review")
@RequiredArgsConstructor
public class IdeaReviewController {

    private final IdeaService ideaService;

    @PreAuthorize("hasAuthority('ROLE_QA_MANAGER')")
    @PostMapping("/approve/{id}")
    public ApiResponse<?> approve(@PathVariable Long id) {
        ideaService.approve(id);
        return ApiResponse.builder().result("Approved").build();
    }

    @PreAuthorize("hasAuthority('ROLE_QA_MANAGER')")
    @PostMapping("/reject/{id}")
    public ApiResponse<?> reject(
            @PathVariable Long id,
            @RequestBody RejectRequest request
    ) {
        ideaService.reject(id, request.getFeedback());
        return ApiResponse.builder().result("Rejected").build();
    }
}
