package com.example.CRM1640.entities.auth;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "terms")
@Getter
@Setter
public class TermsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String version;

    @Column(columnDefinition = "TEXT")
    private String content;

    private boolean active;
}
