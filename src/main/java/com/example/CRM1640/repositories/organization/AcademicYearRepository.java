package com.example.CRM1640.repositories.organization;

import com.example.CRM1640.entities.organization.AcademicYearEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AcademicYearRepository extends JpaRepository<AcademicYearEntity,Long> {
    List<AcademicYearEntity> findByActiveTrue();

    boolean existsByName(String name);

    Optional<AcademicYearEntity> findFirstByActiveTrue();
}
