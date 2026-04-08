package com.example.CRM1640.repositories.authen;

import com.example.CRM1640.entities.auth.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmailOrUsername(String email, String username);

    Optional<UserEntity> findByUsername(String username);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.active = true")
    Long countActiveUsers();

    @Query("""
    SELECT u FROM UserEntity u
    JOIN u.roles r
    WHERE u.department.id = :departmentId
    AND r.name = 'ROLE_STAFF'
""")
    List<UserEntity> findStaffByDepartment(@Param("departmentId") Long departmentId);

    @Query("""
    SELECT u FROM UserEntity u
    JOIN u.roles r
    WHERE r.name = 'ROLE_QA_MANAGER'
    AND u.id NOT IN (
        SELECT d.qaCoordinator.id FROM DepartmentEntity d
        WHERE d.qaCoordinator IS NOT NULL
    )
""")
    Page<UserEntity> findQAManagerWithoutDepartment(Pageable pageable);


}
