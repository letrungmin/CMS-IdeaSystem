package com.example.CRM1640.entities.idea;

import com.example.CRM1640.entities.auth.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private boolean anonymous;

    private LocalDateTime createdAt;

    @PrePersist
    protected void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity author;

    @ManyToOne(fetch = FetchType.LAZY)
    private IdeaEntity idea;
}