package com.example.CRM1640.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ApiResponse<T> {
        @Builder.Default
        int code = 1000;
        T result;
        String message;
        String path;
        @Builder.Default
        String traceId = "None";
        long timestamp;
    }

