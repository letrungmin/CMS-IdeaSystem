package com.example.CRM1640.dto.request;

import com.example.CRM1640.enums.ReactionType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReactionRequest {

    private Long ideaId;

    private ReactionType type;
}
