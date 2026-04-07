package com.example.CRM1640.dto.response;

public record AnalyticsOverviewResponse(
        Long totalIdeas,
        Long activeUsers,
        Double avgReactions,
        Long daysLeft
) {}
