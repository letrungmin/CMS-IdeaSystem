package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.CreateIdeaRequest;
import com.example.CRM1640.dto.response.IdeaDetailResponse;
import com.example.CRM1640.dto.response.IdeaResponse;

public interface IdeaService {
    IdeaResponse submitIdea(CreateIdeaRequest request);

    IdeaDetailResponse getDetail(Long ideaId);
}
