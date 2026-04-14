package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.AcademicYearRequest;
import com.example.CRM1640.dto.response.AcademicYearResponse;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import com.example.CRM1640.enums.AcademicYearStatus;
import com.example.CRM1640.exception.AppException;
import com.example.CRM1640.exception.ErrorCode;
import com.example.CRM1640.mappers.AcademicYearMapper;
import com.example.CRM1640.repositories.authen.DepartmentRepository;
import com.example.CRM1640.repositories.authen.TermsRepository;
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
    private final DepartmentRepository departmentRepository;
    private final TermsRepository termsRepository;

    @Override
    @Transactional
    public AcademicYearResponse create(AcademicYearRequest request) {

        if (repository.existsByName(request.name())) {
            throw new AppException(ErrorCode.ACADEMY_YEAR_NAME_EXIST);
        }

        validateDates(request);

        if (request.active()) {
            throw new AppException(ErrorCode.CANNOT_ACTIVE_WHEN_CREATE);
        }

        AcademicYearEntity entity = mapper.toEntity(request);

        entity.setStatus(AcademicYearStatus.DRAFT);
        entity.setActive(false);

        repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public AcademicYearResponse update(Long id, AcademicYearRequest request) {

        AcademicYearEntity entity = repository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACADEMY_YEAR_NOT_FOUND));

        validateDates(request);

        mapper.updateEntity(entity, request);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Long id) {

        AcademicYearEntity entity = repository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACADEMY_YEAR_NOT_FOUND));

        repository.delete(entity);
    }

    @Override
    public AcademicYearResponse getById(Long id) {

        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.ACADEMY_YEAR_NOT_FOUND));
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
                .orElseThrow(() -> new AppException(ErrorCode.ACADEMY_YEAR_NOT_FOUND));

        if (active) {

            validateTermsReady(entity.getId());

            repository.deactivateAll();

            entity.setActive(true);
            entity.setStatus(AcademicYearStatus.ACTIVE);

        } else {
            entity.setActive(false);
            entity.setStatus(AcademicYearStatus.CLOSED);
        }

        repository.save(entity);

        return mapper.toResponse(entity);
    }

    private void validateTermsReady(Long academicYearId) {

        List<DepartmentEntity> departments = departmentRepository.findAll();

        for (DepartmentEntity dept : departments) {

            boolean exists = termsRepository
                    .existsByDepartmentIdAndAcademicYearIdAndActiveTrue(
                            dept.getId(),
                            academicYearId
                    );

            if (!exists) {
                throw new AppException(ErrorCode.TERM_NOT_READY);
            }
        }
    }

    private void validateDates(AcademicYearRequest request) {

        if (request.ideaClosureDate().isAfter(request.finalClosureDate())) {
            throw new AppException(ErrorCode.ACADEMY_YEAR_MUST_BEFORE_FINAL_CLOSURE);
        }

        if (request.ideaClosureDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.ACADEMY_YEAR_MUST_BE_FUTURE);
        }
    }
}
