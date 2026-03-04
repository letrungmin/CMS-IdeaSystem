package com.example.CRM1640.repositories.authen;

import com.example.CRM1640.entities.auth.TermsAcceptanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTermsAcceptanceRepository
        extends JpaRepository<TermsAcceptanceEntity, Long> {

    boolean existsByUserIdAndTermsId(Long userId, Long termsId);
}
