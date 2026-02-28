package com.example.CRM1640.mappers;

import com.example.CRM1640.dto.response.DepartmentResponse;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class DepartmentMapper {
    public DepartmentResponse toResponse(DepartmentEntity entity) {
        if (entity == null) return null;

        UserResponse qa = null;

        if (entity.getQaCoordinator() != null) {
            qa = new UserResponse(
                    entity.getQaCoordinator().getUuid(),
                    entity.getQaCoordinator().getUsername(),
                    entity.getQaCoordinator().getEmail()
            );
        }

        return new DepartmentResponse(
                entity.getId(),
                entity.getName(),
                qa
        );
    }
}