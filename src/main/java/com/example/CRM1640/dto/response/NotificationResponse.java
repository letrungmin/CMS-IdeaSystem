package com.example.CRM1640.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String type;
    private boolean read;
    private LocalDateTime createdAt;

    // Thay vì lôi nguyên cục IdeaEntity, ta chỉ trả về ID thôi để chống dội JSON
    private IdeaInfo idea;

    @Data
    @AllArgsConstructor
    public static class IdeaInfo {
        private Long id;
    }
}