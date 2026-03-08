package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.AcademicYearRequest;
import com.example.CRM1640.dto.response.AcademicYearResponse;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.mappers.AcademicYearMapper;
import com.example.CRM1640.repositories.organization.AcademicYearRepository;
import com.example.CRM1640.service.interfaces.AcademicYearService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicYearServiceImpl implements AcademicYearService {
    private final AcademicYearRepository repository;
    private final AcademicYearMapper mapper;

    @Override
    @Transactional
    public AcademicYearResponse create(AcademicYearRequest request) {

        if (repository.existsByName(request.name())) {
            throw new RuntimeException("Academic year name already exists");
        }

        validateDates(request);

        AcademicYearEntity entity = mapper.toEntity(request);

        repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public AcademicYearResponse update(Long id, AcademicYearRequest request) {

        AcademicYearEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found"));

        validateDates(request);

        mapper.updateEntity(entity, request);

        repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {

        AcademicYearEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found"));

        repository.delete(entity);
    }

    @Override
    public AcademicYearResponse getById(Long id) {

        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Academic year not found"));
    }

    @Override
    public List<AcademicYearResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<AcademicYearResponse> getActiveYears() {
        return repository.findByActiveTrue()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AcademicYearResponse changeActiveStatus(Long id, boolean active) {

        AcademicYearEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found"));

        entity.setActive(active);

        repository.save(entity);

        return mapper.toResponse(entity);
    }

    private void validateDates(AcademicYearRequest request) {

        if (request.ideaClosureDate().isAfter(request.finalClosureDate())) {
            throw new RuntimeException("Idea closure date must be before final closure date");
        }

        if (request.ideaClosureDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Idea closure date must be in the future");
        }
    }
}
