package com.example.CRM1640.entities.idea;

import com.example.CRM1640.entities.auth.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "comments",
        indexes = {
                @Index(name = "idx_comment_idea", columnList = "idea_id"),
                @Index(name = "idx_comment_parent", columnList = "parent_id"),
                @Index(name = "idx_comment_created", columnList = "createdAt")
        }
)
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

    // 👉 count replies
    @Column(nullable = false)
    private Long replyCount = 0L;

    // 👉 count reactions
    @Column(nullable = false)
    private Long likeCount = 0L;

    @PrePersist
    protected void prePersist() {
        createdAt = LocalDateTime.now();
    }

    // ===== AUTHOR =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private UserEntity author;

    // ===== IDEA =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id", nullable = false)
    private IdeaEntity idea;

    // ===== PARENT =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private CommentEntity parent;

    // ===== CHILDREN =====
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private Set<CommentEntity> replies = new HashSet<>();
}