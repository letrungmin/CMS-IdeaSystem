package com.example.CRM1640.entities.other;

import com.example.CRM1640.enums.IdeaEventType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IdeaEvent {

    private Long ideaId;
    private String title;
    private String content;

    private String authorEmail;
    private String authorName;

    private String feedback;

    private String qaManagerEmail;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private IdeaEventType type;
}
