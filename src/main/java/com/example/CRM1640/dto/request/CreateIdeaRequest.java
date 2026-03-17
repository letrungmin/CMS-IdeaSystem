package com.example.CRM1640.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CreateIdeaRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private boolean anonymous;

    @NotEmpty
    private List<Long> categoryIds;
}
