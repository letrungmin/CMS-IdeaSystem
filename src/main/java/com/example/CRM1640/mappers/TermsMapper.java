package com.example.CRM1640.mappers;

import com.example.CRM1640.dto.request.TermsRequest;
import com.example.CRM1640.dto.response.TermsResponse;
import com.example.CRM1640.entities.auth.TermsEntity;
import org.springframework.stereotype.Component;

@Component
public class TermsMapper {

    public TermsEntity toEntity(TermsRequest request) {
        TermsEntity entity = new TermsEntity();
        entity.setTitle(request.title());
        entity.setContent(request.content());
        entity.setVersion(request.version());
        return entity;
    }

    public void update(TermsEntity entity, TermsRequest request) {
        entity.setTitle(request.title());
        entity.setContent(request.content());
        entity.setVersion(request.version());
    }

    public TermsResponse toResponse(TermsEntity entity) {
        return new TermsResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getContent(),
                entity.getVersion(),
                entity.isActive(),
                entity.getStatus(),
                entity.getDepartment().getId(),
                entity.getDepartment().getName(),
                entity.getAcademicYear().getId(),
                entity.getAcademicYear().getName(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
