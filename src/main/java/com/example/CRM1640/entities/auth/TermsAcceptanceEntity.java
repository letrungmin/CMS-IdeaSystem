package com.example.CRM1640.entities.auth;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "terms_acceptance")
@Getter
@Setter
public class TermsAcceptanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime acceptedAt;

    @PrePersist
    protected void prePersist() {
        acceptedAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    private TermsEntity terms;
}
