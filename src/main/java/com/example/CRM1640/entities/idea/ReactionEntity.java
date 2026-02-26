package com.example.CRM1640.entities.idea;

import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.enums.ReactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "reactions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"idea_id", "user_id"})
)
@Getter
@Setter
public class ReactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ReactionType type;

    private LocalDateTime createdAt;

    @PrePersist
    protected void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    private IdeaEntity idea;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity user;
}