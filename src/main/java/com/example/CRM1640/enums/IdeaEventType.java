package com.example.CRM1640.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum IdeaEventType {
    SUBMITTED,
    APPROVED,
    REJECTED;


    @JsonCreator
    public static IdeaEventType from(String value) {
        return IdeaEventType.valueOf(value.toUpperCase());
    }
}
