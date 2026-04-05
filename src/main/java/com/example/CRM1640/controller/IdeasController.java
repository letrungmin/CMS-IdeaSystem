package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.CreateIdeaRequest;
import com.example.CRM1640.dto.response.IdeaDetailResponse;
import com.example.CRM1640.dto.response.IdeaResponse;
import com.example.CRM1640.service.interfaces.IdeaService;
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

import java.util.List;

@RestController
@RequestMapping("/idea")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IdeasController {

    IdeaService ideaService;

    // ================= CREATE =================
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<IdeaResponse> submitIdea(
            @RequestPart("data") @Valid CreateIdeaRequest request,
            @RequestPart(value = "image", required = false) List<MultipartFile> files,
            HttpServletRequest http
    ) {

        return ApiResponse.<IdeaResponse>builder()
                .result(ideaService.submitIdea(request, files))
                .message("Submit idea successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= DETAIL =================
    @GetMapping("/{id}")
    public ApiResponse<IdeaDetailResponse> getIdeaDetail(
            @PathVariable Long id,
            HttpServletRequest http
    ) {

        return ApiResponse.<IdeaDetailResponse>builder()
                .result(ideaService.getDetail(id))
                .message("Get idea detail successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= GET ALL =================
    @GetMapping
    public ApiResponse<Page<IdeaDetailResponse>> getAllIdeas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest http
    ) {

        return ApiResponse.<Page<IdeaDetailResponse>>builder()
                .result(ideaService.getAllIdeas(page, size))
                .message("Get all ideas successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }


    // ================= GET ALL pending Ideas =================
    @PreAuthorize("hasAuthority('ROLE_QA_MANAGER')")
    @GetMapping("/pending")
    public ApiResponse<Page<IdeaDetailResponse>> getAllPendingIdeas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest http
    ) {

        return ApiResponse.<Page<IdeaDetailResponse>>builder()
                .result(ideaService.getAllPending(page, size))
                .message("Get all ideas successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= GET Reject ALL =================
    @PreAuthorize("hasAuthority('ROLE_QA_MANAGER')")
    @GetMapping("/reject")
    public ApiResponse<Page<IdeaDetailResponse>> getAllRejectIdeas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest http
    ) {

        return ApiResponse.<Page<IdeaDetailResponse>>builder()
                .result(ideaService.getAllIReject(page, size))
                .message("Get all ideas successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= GET all Status idea =================
    @PreAuthorize("hasAuthority('ROLE_QA_MANAGER')")
    @GetMapping("/all_status")
    public ApiResponse<Page<IdeaDetailResponse>> getAllStatusIdeas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest http
    ) {

        return ApiResponse.<Page<IdeaDetailResponse>>builder()
                .result(ideaService.getAllStatusIdeas(page, size))
                .message("Get all ideas successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= APPROVED =================
    @GetMapping("/my/approved")
    public ApiResponse<Page<IdeaDetailResponse>> getMyApproved(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest http
    ) {
        return ApiResponse.<Page<IdeaDetailResponse>>builder()
                .result(ideaService.getAllMyApprovedIdeas(page, size))
                .message("Get my approved ideas successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= PENDING =================
    @GetMapping("/my/pending")
    public ApiResponse<Page<IdeaDetailResponse>> getMyPending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest http
    ) {
        return ApiResponse.<Page<IdeaDetailResponse>>builder()
                .result(ideaService.getAllMyPendingIdeas(page, size))
                .message("Get my pending ideas successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= REJECTED =================
    @GetMapping("/my/rejected")
    public ApiResponse<Page<IdeaDetailResponse>> getMyRejected(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest http
    ) {
        return ApiResponse.<Page<IdeaDetailResponse>>builder()
                .result(ideaService.getAllMyRejectedIdeas(page, size))
                .message("Get my rejected ideas successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= MY IDEAS =================
    @GetMapping("/me")
    public ApiResponse<Page<IdeaDetailResponse>> getMyIdeas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest http
    ) {

        return ApiResponse.<Page<IdeaDetailResponse>>builder()
                .result(ideaService.getMyIdeas(page, size))
                .message("Get my ideas successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }
}