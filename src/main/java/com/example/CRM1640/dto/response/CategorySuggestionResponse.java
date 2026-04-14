package com.example.CRM1640.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CategorySuggestionResponse {

    @JsonProperty("assigned_category")
    private String assignedCategory;

    @JsonProperty("ai_explanation")
    private String aiExplanation;

    @JsonProperty("processing_time_ms")
    private double processingTimeMs;
}
