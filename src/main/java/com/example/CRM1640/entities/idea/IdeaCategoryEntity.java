package com.example.CRM1640.entities.idea;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "idea_category",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_idea_category_unique",
                        columnNames = {"idea_id", "category_id"}
                )
        }
)
@Getter
@Setter
public class IdeaCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ========== MANY TO ONE ==========
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id", nullable = false)
    private IdeaEntity idea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    // ========== METADATA ==========
    private LocalDateTime assignedAt;

    @PrePersist
    protected void prePersist() {
        assignedAt = LocalDateTime.now();
    }
}