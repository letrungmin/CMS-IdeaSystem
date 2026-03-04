package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.AcceptTermsRequest;
import com.example.CRM1640.dto.response.TermsStatusResponse;
import com.example.CRM1640.entities.auth.TermsAcceptanceEntity;
import com.example.CRM1640.entities.auth.TermsEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.repositories.authen.TermsRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.authen.UserTermsAcceptanceRepository;
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

    @Override
    public TermsStatusResponse getMyTermsStatus() {

        Long userId = getCurrentUserId();

        TermsEntity activeTerms = termsRepository.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active terms found"));

        boolean accepted = acceptanceRepository
                .existsByUserIdAndTermsId(userId, activeTerms.getId());

        return new TermsStatusResponse(
                accepted,
                activeTerms.getId(),
                activeTerms.getVersion()
        );
    }

    @Override
    @Transactional
    public void acceptTerms(AcceptTermsRequest request) {

        Long userId = getCurrentUserId();

        TermsEntity terms = termsRepository.findById(request.termsId())
                .orElseThrow(() -> new RuntimeException("Terms not found"));

        boolean alreadyAccepted = acceptanceRepository
                .existsByUserIdAndTermsId(userId, terms.getId());

        if (alreadyAccepted) {
            return; // idempotent
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TermsAcceptanceEntity acceptance = new TermsAcceptanceEntity();
        acceptance.setUser(user);
        acceptance.setTerms(terms);

        acceptanceRepository.save(acceptance);
    }

    private Long getCurrentUserId() {


        String username = "testuser"; // Test Data, this function will be implemented after the security function completed

//                SecurityContextHolder.getContext()
//                .getAuthentication()
//                .getName();

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }
}
