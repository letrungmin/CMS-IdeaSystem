package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.CreateIdeaRequest;
import com.example.CRM1640.dto.response.IdeaDetailResponse;
import com.example.CRM1640.dto.response.IdeaResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IdeaService {
    IdeaResponse submitIdea(CreateIdeaRequest request, List<MultipartFile> files);

    IdeaDetailResponse getDetail(Long ideaId);

    Page<IdeaDetailResponse> getAllIdeas(int page, int size);

    Page<IdeaDetailResponse> getMyIdeas(int page, int size);

    void approve(Long ideaId);

    void reject(Long ideaId, String feedback);

    Page<IdeaDetailResponse> getAllIReject(int page, int size);

    Page<IdeaDetailResponse> getAllPending(int page, int size);

    Page<IdeaDetailResponse> getAllStatusIdeas(int page, int size);
}
