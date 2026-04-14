package com.example.CRM1640.entities.organization;

import com.example.CRM1640.enums.AcademicYearStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "academic_years")
@Getter
@Setter
public class AcademicYearEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private LocalDateTime ideaClosureDate;

    @Column(nullable = false)
    private LocalDateTime finalClosureDate;

    private boolean active;

    @Enumerated(EnumType.STRING)
    private AcademicYearStatus status;
}