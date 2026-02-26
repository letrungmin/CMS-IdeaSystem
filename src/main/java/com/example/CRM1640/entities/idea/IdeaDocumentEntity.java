package com.example.CRM1640.entities.idea;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "idea_documents")
@Getter
@Setter
public class IdeaDocumentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalName;

    private String storedName;

    private String filePath;

    private Long fileSize;

    private String contentType;

    private LocalDateTime uploadedAt;

    @PrePersist
    protected void prePersist() {
        uploadedAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    private IdeaEntity idea;
}