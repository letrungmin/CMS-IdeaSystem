package com.example.CRM1640.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IdeaResponse {

    private Long id;
    private String title;
    private String content;
    private boolean anonymous;
    private Long viewCount;
    private LocalDateTime createdAt;
    private String authorName;
    private String departmentName;
    private String academicYearName;
    private List<String> categories;
}
