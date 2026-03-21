package com.example.CRM1640.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record IdeaDetailResponse(
        Long id,
        String title,
        String content,
        boolean anonymous,
        String authorName,
        String departmentName,
        String academicYearName,
        Long viewCount,
        LocalDateTime createdAt,

        List<String> categories,

        Map<String, Long> reactions,
        Long totalReactions,
        String myReaction,

        Long commentCount
) {}
