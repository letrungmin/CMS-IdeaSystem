package com.example.CRM1640.entities.organization;

import com.example.CRM1640.entities.auth.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "departments",
        indexes = {
                @Index(name = "idx_department_name", columnList = "name")
        }
)
@Getter
@Setter
public class DepartmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // QA Coordinator of department
    @OneToOne
    @JoinColumn(name = "qa_coordinator_id")
    private UserEntity qaCoordinator;

    @OneToMany(mappedBy = "department")
    private Set<UserEntity> users = new HashSet<>();
}