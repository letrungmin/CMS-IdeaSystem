package com.example.CRM1640.repositories.authen;

import com.example.CRM1640.entities.auth.TermsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface TermsRepository extends JpaRepository<TermsEntity,Long> {
    Optional<TermsEntity> findByActiveTrue();

    Optional<TermsEntity> findByDepartmentIdAndAcademicYearIdAndActiveTrue(
            Long departmentId,
            Long academicYearId
    );

    boolean existsByDepartmentIdAndAcademicYearIdAndActiveTrue(
            Long departmentId,
            Long academicYearId
    );

    List<TermsEntity> findByAcademicYearId(Long academicYearId);


    @Modifying
    @Query("""
        UPDATE TermsEntity t
        SET t.active = false
        WHERE t.department.id = :departmentId
        AND t.academicYear.id = :academicYearId
    """)
    void deactivateByDepartmentAndYear(Long departmentId, Long academicYearId);
}
