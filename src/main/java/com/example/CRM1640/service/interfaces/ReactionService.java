package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.ReactionRequest;
import com.example.CRM1640.dto.response.ReactionResponse;

public interface ReactionService {
    ReactionResponse react(ReactionRequest request);
}
