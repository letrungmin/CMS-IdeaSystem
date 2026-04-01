package com.example.CRM1640.entities.idea;

import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import com.example.CRM1640.enums.IdeaStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(
        name = "ideas",
        indexes = {
                @Index(name = "idx_idea_uuid", columnList = "uuid"),
                @Index(name = "idx_idea_created_at", columnList = "createdAt"),
                @Index(name = "idx_idea_view_count", columnList = "viewCount")
        }
)
@Getter
@Setter
public class IdeaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @PrePersist
    protected void prePersist() {
        if (uuid == null) uuid = UUID.randomUUID();
        createdAt = LocalDateTime.now();
    }

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private boolean anonymous;

    private Long viewCount = 0L;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Long likeCount = 0L;

    @Column(nullable = false)
    private Long dislikeCount = 0L;

    // ================= AUTHOR =================
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private UserEntity author;

    // ================= ORGANIZATION =================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private DepartmentEntity department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYearEntity academicYear;

    // ================= RELATIONS =================
    @OneToMany(mappedBy = "idea", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<IdeaCategoryEntity> ideaCategories = new HashSet<>();

    @OneToMany(mappedBy = "idea", cascade = CascadeType.ALL)
    private Set<CommentEntity> comments = new HashSet<>();

    @OneToMany(mappedBy = "idea", cascade = CascadeType.ALL)
    private Set<ReactionEntity> reactions = new HashSet<>();

    @OneToMany(mappedBy = "idea", cascade = CascadeType.ALL)
    private Set<IdeaDocumentEntity> documents = new HashSet<>();

    @Column(nullable = false)
    private Long commentCount = 0L;


    // ================= Tracking idea flow =================
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdeaStatus status = IdeaStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime approvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private UserEntity approvedBy;
}