package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.CreateCommentRequest;
import com.example.CRM1640.dto.response.CommentResponse;
import com.example.CRM1640.service.interfaces.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // ================= CREATE =================
    @PostMapping
    public ApiResponse<CommentResponse> create(
            @RequestBody CreateCommentRequest request,
            HttpServletRequest http
    ) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.create(request))
                .message("Create comment successfully")
                .path(http.getRequestURI())
                .timestamp(Instant.now().toEpochMilli())
                .build();
    }

    // ================= ROOT COMMENTS =================
    @GetMapping("/idea/{ideaId}")
    public ApiResponse<Page<CommentResponse>> getRootComments(
            @PathVariable Long ideaId,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "newest") String sort,
            HttpServletRequest http
    ) {
        return ApiResponse.<Page<CommentResponse>>builder()
                .result(commentService.getRootComments(ideaId, page, size, sort))
                .message("Get root comments successfully")
                .path(http.getRequestURI())
                .timestamp(Instant.now().toEpochMilli())
                .build();
    }

    // ================= REPLIES =================
    @GetMapping("/{commentId}/replies")
    public ApiResponse<List<CommentResponse>> getReplies(
            @PathVariable Long commentId,
            HttpServletRequest http
    ) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getReplies(commentId))
                .message("Get replies successfully")
                .path(http.getRequestURI())
                .timestamp(Instant.now().toEpochMilli())
                .build();
    }
}