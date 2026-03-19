package com.example.CRM1640.entities.auth;

import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "terms")
@Getter
@Setter
public class TermsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String content;

    private String version;

    private boolean active;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private DepartmentEntity department;

    @ManyToOne
    @JoinColumn(name = "academic_year_id")
    private AcademicYearEntity academicYear;
}