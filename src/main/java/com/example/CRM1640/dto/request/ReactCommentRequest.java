package com.example.CRM1640.dto.request;

import com.example.CRM1640.enums.ReactionType;

public record ReactCommentRequest(
        Long commentId,
        ReactionType type
) {}