package com.example.CRM1640.entities.system;

import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "notifications",
        indexes = {
                @Index(name = "idx_notification_uuid", columnList = "uuid"),
                @Index(name = "idx_notification_receiver", columnList = "receiver_id"),
                @Index(name = "idx_notification_read", columnList = "isRead"),
                @Index(name = "idx_notification_created_at", columnList = "createdAt")
        }
)
@Getter
@Setter
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= UUID =================
    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @PrePersist
    protected void prePersist() {
        if (uuid == null) uuid = UUID.randomUUID();
        createdAt = LocalDateTime.now();
    }

    // ================= CONTENT =================
    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    // ================= TYPE =================
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    // ================= STATUS =================
    @Column(nullable = false)
    private boolean isRead = false;

    private LocalDateTime readAt;

    private LocalDateTime createdAt;

    // ================= RELATIONSHIPS =================

    // The user who receives this notification
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private UserEntity receiver;

    // The user who triggered this notification (optional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private UserEntity actor;

    // The related idea (optional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id")
    private IdeaEntity idea;
}
