package com.example.CRM1640.repositories;

import com.example.CRM1640.entities.organization.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity,Long> {
}
