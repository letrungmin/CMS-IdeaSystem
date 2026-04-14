package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.AcceptTermsRequest;
import com.example.CRM1640.dto.request.TermsRequest;
import com.example.CRM1640.dto.response.TermsResponse;
import com.example.CRM1640.dto.response.TermsStatusResponse;
import com.example.CRM1640.entities.auth.TermsAcceptanceEntity;
import com.example.CRM1640.entities.auth.TermsEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import com.example.CRM1640.enums.TermsStatus;
import com.example.CRM1640.exception.AppException;
import com.example.CRM1640.exception.ErrorCode;
import com.example.CRM1640.mappers.TermsMapper;
import com.example.CRM1640.repositories.authen.DepartmentRepository;
import com.example.CRM1640.repositories.authen.TermsRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.authen.UserTermsAcceptanceRepository;
import com.example.CRM1640.repositories.organization.AcademicYearRepository;
import com.example.CRM1640.service.interfaces.TermService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TermsServiceImpl implements TermService {

    private final TermsRepository termsRepository;
    private final UserTermsAcceptanceRepository acceptanceRepository;
    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;
    private final DepartmentRepository departmentRepository;
    private final TermsMapper mapper;

    @Override
    public TermsStatusResponse getMyTermsStatus() {

        UserEntity currentUser = getCurrentUser();

        // get active academic year
        AcademicYearEntity academicYear = academicYearRepository
                .findFirstByActiveTrue()
                .orElseThrow(() -> new AppException(ErrorCode.NON_ACTIVATE_ACADEMY_YEAR));

        // get terms by department + academic year
        TermsEntity terms = termsRepository
                .findByDepartmentIdAndAcademicYearIdAndActiveTrue(
                        currentUser.getDepartment().getId(),
                        academicYear.getId()
                )
                .orElseThrow(() -> new AppException(ErrorCode.NO_TERM_FOUND));

        // check accepted
        boolean accepted = acceptanceRepository
                .existsByUserIdAndTermsId(currentUser.getId(), terms.getId());

        return new TermsStatusResponse(
                accepted,
                terms.getId(),
                terms.getVersion()
        );
    }

    @Override
    @Transactional
    public void acceptTerms(AcceptTermsRequest request) {

        UserEntity currentUser = getCurrentUser();

        TermsEntity terms = termsRepository.findById(request.termsId())
                .orElseThrow(() -> new AppException(ErrorCode.NO_TERM_FOUND));

        boolean alreadyAccepted = acceptanceRepository
                .existsByUserIdAndTermsId(currentUser.getId(), terms.getId());

        if (alreadyAccepted) {
            return; // idempotent
        }

        UserEntity user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        TermsAcceptanceEntity acceptance = new TermsAcceptanceEntity();
        acceptance.setUser(user);
        acceptance.setTerms(terms);

        acceptanceRepository.save(acceptance);
    }

    @Override
    @Transactional
    public TermsResponse create(TermsRequest request) {

        DepartmentEntity dept = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        AcademicYearEntity year = academicYearRepository.findById(request.academicYearId())
                .orElseThrow(() -> new AppException(ErrorCode.ACADEMY_YEAR_NOT_FOUND));

        TermsEntity entity = mapper.toEntity(request);

        entity.setDepartment(dept);
        entity.setAcademicYear(year);
        entity.setStatus(TermsStatus.DRAFT);
        entity.setActive(false);

        return mapper.toResponse(termsRepository.save(entity));
    }

    @Override
    @Transactional
    public TermsResponse update(Long id, TermsRequest request) {

        TermsEntity entity = termsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TERM_NOT_FOUND));

        if (entity.getStatus() == TermsStatus.PUBLISHED) {
            throw new AppException(ErrorCode.CANNOT_UPDATE_PUBLISHED_TERM);
        }

        mapper.update(entity, request);

        return mapper.toResponse(termsRepository.save(entity));
    }

    @Override
    @Transactional
    public TermsResponse publish(Long id) {

        TermsEntity entity = termsRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TERM_NOT_FOUND));

        // deactivate old term
        termsRepository.deactivateByDepartmentAndYear(
                entity.getDepartment().getId(),
                entity.getAcademicYear().getId()
        );

        entity.setStatus(TermsStatus.PUBLISHED);
        entity.setActive(true);

        return mapper.toResponse(termsRepository.save(entity));
    }

    @Override
    public List<TermsResponse> getByAcademicYear(Long academicYearId) {

        return termsRepository.findByAcademicYearId(academicYearId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    private UserEntity getCurrentUser() {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    String username = authentication.getName();

    return userRepository.findByUsername(username)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
}
}
