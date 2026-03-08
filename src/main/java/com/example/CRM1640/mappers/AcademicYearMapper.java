package com.example.CRM1640.mappers;

import com.example.CRM1640.dto.request.AcademicYearRequest;
import com.example.CRM1640.dto.response.AcademicYearResponse;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import org.springframework.stereotype.Component;

@Component
public class AcademicYearMapper {

    public AcademicYearEntity toEntity(AcademicYearRequest request) {

        if (request == null) return null;

        AcademicYearEntity entity = new AcademicYearEntity();
        entity.setName(request.name());
        entity.setIdeaClosureDate(request.ideaClosureDate());
        entity.setFinalClosureDate(request.finalClosureDate());
        entity.setActive(request.active());

        return entity;
    }

    public void updateEntity(AcademicYearEntity entity, AcademicYearRequest request) {

        if (entity == null || request == null) return;

        entity.setName(request.name());
        entity.setIdeaClosureDate(request.ideaClosureDate());
        entity.setFinalClosureDate(request.finalClosureDate());
        entity.setActive(request.active());
    }

    public AcademicYearResponse toResponse(AcademicYearEntity entity) {

        if (entity == null) return null;

        return new AcademicYearResponse(
                entity.getId(),
                entity.getName(),
                entity.getIdeaClosureDate(),
                entity.getFinalClosureDate(),
                entity.isActive()
        );
    }
}
