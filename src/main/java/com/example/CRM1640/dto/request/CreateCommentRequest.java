package com.example.CRM1640.dto.request;

public record CreateCommentRequest(
        Long ideaId,
        String content,
        boolean anonymous,
        Long parentId // null = root
) {}
