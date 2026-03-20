package com.example.CRM1640.dto.response;

import com.example.CRM1640.enums.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@AllArgsConstructor
@Getter
public class ReactionResponse {

    // Count of each reaction type
    private Map<ReactionType, Long> counts;

    // Total reactions
    private Long total;

    // Current user's reaction
    private String myReaction;
}
