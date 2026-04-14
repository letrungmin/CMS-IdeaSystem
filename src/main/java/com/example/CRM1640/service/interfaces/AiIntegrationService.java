package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.response.CategorySuggestionResponse;

public interface AiIntegrationService {
     boolean isDuplicate(String content);
    void storeIdeaToVectorDb(Long ideaId, String content, String category);

    boolean isOutOfDistribution(String textToAnalyze);

    CategorySuggestionResponse suggestCategory(String combinedText);
}
