package com.example.CRM1640.entities.other;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EncourageEvent {

    private Long departmentId;
    private String departmentName;

    private List<String> emails;
    private String message;

    private String senderName;
}
