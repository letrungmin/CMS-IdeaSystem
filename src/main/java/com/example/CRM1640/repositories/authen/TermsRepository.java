package com.example.CRM1640.repositories.authen;

import com.example.CRM1640.entities.auth.TermsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TermsRepository extends JpaRepository<TermsEntity,Long> {
    Optional<TermsEntity> findByActiveTrue();

    Optional<TermsEntity> findByDepartmentIdAndAcademicYearIdAndActiveTrue(
            Long departmentId,
            Long academicYearId
    );
}
