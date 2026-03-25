package com.example.CRM1640.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record CommentResponse(
        Long id,
        String content,
        String authorName,
        boolean anonymous,
        LocalDateTime createdAt,

        Long replyCount,

        Map<String, Long> reactions,
        Long totalReactions,
        String myReaction,

        List<CommentResponse> replies
) {}
