package com.example.CRM1640.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DuplicateCheckResponse {

    @JsonProperty("is_duplicate")
    private boolean isDuplicate;

    @JsonProperty("highest_similarity_score")
    private double highestSimilarityScore;

    @JsonProperty("most_similar_idea")
    private String mostSimilarIdea;

    @JsonProperty("processing_time_ms")
    private double processingTimeMs;
}
