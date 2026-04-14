package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.response.CategorySuggestionResponse;
import com.example.CRM1640.dto.response.DuplicateCheckResponse;
import com.example.CRM1640.dto.response.OodCheckResponse;
import com.example.CRM1640.service.interfaces.AiIntegrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AiIntegrationServiceImpl implements AiIntegrationService{

    private static final Logger logger = LoggerFactory.getLogger(AiIntegrationService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    // Port 8000 for Python FastAPI
    @Value("${ai.duplicate.check.url:http://127.0.0.1:8000/api/v1/ai/check-duplicate}")
    private String checkDuplicateUrl;

    @Value("${ai.vector.store.url:http://127.0.0.1:8000/api/v1/ai/ideas}")
    private String storeVectorUrl;

    @Value("${ai.ood.check.url:http://127.0.0.1:8000/api/v1/ai/check-ood}")
    private String checkOodUrl;

    @Value("${ai.categorize.url:http://127.0.0.1:8000/api/v1/ai/categorize}")
    private String categorizeUrl;


    /**
     * PHASE 1: CHECK FOR SEMANTIC DUPLICATES (Synchronous - Blocks if duplicate)
     * @param content The text content of the idea.
     * @return true if a duplicate is found, false otherwise.
     */
    public boolean isDuplicate(String content) {
        try {
            Map<String, String> request = Map.of("content", content);
            ResponseEntity<DuplicateCheckResponse> response = restTemplate.postForEntity(
                    checkDuplicateUrl, request, DuplicateCheckResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().isDuplicate();
            }
        } catch (Exception e) {
            // GRACEFUL DEGRADATION: Unlike toxicity checks, if the duplicate checker is down,
            // we allow the submission to pass so user experience is not disrupted.
            logger.error("AI Semantic Search failed. Bypassing duplicate check. Error: {}", e.getMessage());
        }
        return false; // Defaults to safe
    }

    /**
     * PHASE 2: STORE IDEA EMBEDDINGS IN VECTOR DB (Asynchronous - Runs in background)
     */
    @Async
    public void storeIdeaToVectorDb(Long ideaId, String content, String category) {
        try {
            Map<String, Object> request = Map.of(
                    "idea_id", String.valueOf(ideaId),
                    "content", content,
                    "category", category != null ? category : "general"
            );
            restTemplate.postForEntity(storeVectorUrl, request, Map.class);
            logger.info("Successfully synced Idea ID [{}] to Chroma VectorDB.", ideaId);
        } catch (Exception e) {
            logger.error("Failed to sync Idea ID [{}] to VectorDB. Error: {}", ideaId, e.getMessage());
        }
    }
    public boolean isOutOfDistribution(String content) {
        try {
            Map<String, String> request = Map.of("content", content);
            ResponseEntity<OodCheckResponse> response = restTemplate.postForEntity(
                    checkOodUrl, request, OodCheckResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().isOutOfDistribution();
            }
        } catch (Exception e) {
            logger.error("AI OOD Detection failed. Bypassing check. Error: {}", e.getMessage());
        }
        return false; // Defaults to safe if AI is down
    }
    public CategorySuggestionResponse suggestCategory(String content) {
        try {
            Map<String, String> request = Map.of("content", content);
            ResponseEntity<CategorySuggestionResponse> response = restTemplate.postForEntity(
                    categorizeUrl, request, CategorySuggestionResponse.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (Exception e) {
            logger.error("AI Categorization failed. Error: {}", e.getMessage());
        }
        return null;
    }
}
