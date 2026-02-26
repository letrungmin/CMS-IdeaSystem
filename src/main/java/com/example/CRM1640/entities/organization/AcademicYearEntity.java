package com.example.CRM1640.entities.organization;

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
    private String name; // 2025-2026

    @Column(nullable = false)
    private LocalDateTime ideaClosureDate;

    @Column(nullable = false)
    private LocalDateTime finalClosureDate;

    private boolean active;
}