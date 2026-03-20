package com.example.CRM1640.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record CommentResponse(
        Long id,
        String content,
        String authorName,
        boolean anonymous,
        LocalDateTime createdAt,
        Long replyCount,
        Long likeCount,
        List<CommentResponse> replies
) {}
