package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.response.AiModerationResponse;
import com.example.CRM1640.service.interfaces.ModerationService;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ModerationServiceImpt implements ModerationService {

    private static final Logger logger = LoggerFactory.getLogger(ModerationService.class);
    private final RestTemplate restTemplate;

    @Value("${ai.moderation.url:http://localhost:8000/api/v1/moderate}")
    private String aiServiceUrl;

    public ModerationServiceImpt() {
        this.restTemplate = new RestTemplate();
        // Enterprise Note: In production, configure this RestTemplate as a Bean
        // with strict connection and read timeouts (e.g., 3000ms) to prevent thread blocking.
    }


    /**
     * Sends the idea content to the external Python AI engine for toxicity evaluation.
     * * @param content The text content of the user's idea
     * @return boolean True if safe (approved), False if toxic or if the AI service fails.
     */
    public boolean isSafe(String content) {
        // Skip validation if content is completely empty
        if (content == null || content.trim().isEmpty()) {
            return true;
        }

        Map<String, String> requestPayload = Map.of("content", content);

        try {
            ResponseEntity<AiModerationResponse> response = restTemplate.postForEntity(
                    aiServiceUrl,
                    requestPayload,
                    AiModerationResponse.class
            );

            AiModerationResponse body = response.getBody();

            // Check if the AI strictly approved the content
            if (response.getStatusCode() == HttpStatus.OK && body != null) {
                return "approved".equalsIgnoreCase(body.getStatus());
            } else {
                logger.warn("AI Moderation rejected the payload. Status code: {}", response.getStatusCode());
                if (body != null && body.getReason() != null) {
                    logger.warn("Rejection Reason: {}", body.getReason());
                }
                return false; // Content is toxic
            }

        } catch (Exception e) {
            // Graceful Degradation / Fail-Secure Mechanism
            logger.error("Critical failure while communicating with Python AI Service: {}", e.getMessage());

            // Returning 'false' ensures that if the AI is down, no potentially toxic
            // ideas bypass the filter. This acts as a strict security gate.
            return false;
        }
    }
}
