package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.ReactCommentRequest;
import com.example.CRM1640.dto.request.ReactionRequest;
import com.example.CRM1640.dto.response.ReactionResponse;
import com.example.CRM1640.service.interfaces.ReactionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reactions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReactionController {

    ReactionService reactionService;

    // ================= REACT IDEA =================
    @PostMapping("/idea")
    public ApiResponse<ReactionResponse> react(
            @RequestBody ReactionRequest request,
            HttpServletRequest http
    ) {

        return ApiResponse.<ReactionResponse>builder()
                .result(reactionService.react(request))
                .message("React idea successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= REACT COMMENT =================
    @PostMapping("/comment")
    public ApiResponse<ReactionResponse> reactComment(
            @RequestBody ReactCommentRequest request,
            HttpServletRequest http
    ) {

        return ApiResponse.<ReactionResponse>builder()
                .result(reactionService.reactComment(request))
                .message("React comment successfully")
                .path(http.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }
}