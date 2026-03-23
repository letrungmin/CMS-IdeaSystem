package com.example.CRM1640.dto.response;

public record CommentPreviewResponse(
        Long id,
        String content,
        String authorName
) {}
