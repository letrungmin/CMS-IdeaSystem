package com.example.CRM1640.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OodCheckResponse {

    @JsonProperty("is_out_of_distribution")
    private boolean isOutOfDistribution;

    @JsonProperty("domain_relevance_score")
    private double domainRelevanceScore;

    @JsonProperty("reason")
    private String reason;
}