package com.example.CRM1640.entities.idea;

import com.example.CRM1640.enums.FileType;
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

    private String fileName;

    private String fileUrl;

    @Enumerated(EnumType.STRING)
    private FileType type;

    private Long size;

    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id")
    private IdeaEntity idea;
}