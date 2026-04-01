package com.example.CRM1640.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record IdeaDetailResponse(
        Long id,
        String title,
        String content,
        boolean anonymous,

        // NEW
        Long authorId,
        String authorName,
        String authorAvatar,

        String departmentName,
        String academicYearName,

        Long viewCount,
        LocalDateTime createdAt,

        List<String> categories,

        Map<String, Long> reactions,
        long totalReactions,
        String myReaction,

        Long commentCount,

        List<String> images,
        List<FileResponse> attachments,

        String status
) {}
