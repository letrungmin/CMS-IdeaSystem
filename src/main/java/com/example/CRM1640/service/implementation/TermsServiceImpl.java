package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.AcceptTermsRequest;
import com.example.CRM1640.dto.request.MyTermStatusRequest;
import com.example.CRM1640.dto.response.TermsStatusResponse;
import com.example.CRM1640.entities.auth.TermsAcceptanceEntity;
import com.example.CRM1640.entities.auth.TermsEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.repositories.authen.TermsRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.authen.UserTermsAcceptanceRepository;
import com.example.CRM1640.repositories.organization.AcademicYearRepository;
import com.example.CRM1640.service.interfaces.TermService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TermsServiceImpl implements TermService {

    private final TermsRepository termsRepository;
    private final UserTermsAcceptanceRepository acceptanceRepository;
    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;

    @Override
    public TermsStatusResponse getMyTermsStatus() {

        UserEntity currentUser = getCurrentUserId();

        // get active academic year
        AcademicYearEntity academicYear = academicYearRepository
                .findFirstByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active academic year"));

        // get terms theo department + academic year
        TermsEntity terms = termsRepository
                .findByDepartmentIdAndAcademicYearIdAndActiveTrue(
                        currentUser.getDepartment().getId(),
                        academicYear.getId()
                )
                .orElseThrow(() -> new RuntimeException("No terms found"));

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

        UserEntity currentUserId = getCurrentUserId();

        TermsEntity terms = termsRepository.findById(request.termsId())
                .orElseThrow(() -> new RuntimeException("Terms not found"));

        boolean alreadyAccepted = acceptanceRepository
                .existsByUserIdAndTermsId(currentUserId.getId(), terms.getId());

        if (alreadyAccepted) {
            return; // idempotent
        }

        UserEntity user = userRepository.findById(currentUserId.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TermsAcceptanceEntity acceptance = new TermsAcceptanceEntity();
        acceptance.setUser(user);
        acceptance.setTerms(terms);

        acceptanceRepository.save(acceptance);
    }

    private UserEntity getCurrentUserId() {


        String username = "tes6tuser2"; // Test Data, this function will be implemented after the security function completed

//                SecurityContextHolder.getContext()
//                .getAuthentication()
//                .getName();

        return  userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));


    }
}
