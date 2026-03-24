package com.example.CRM1640.repositories.idea;

import com.example.CRM1640.entities.idea.IdeaDocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IdeaDocumentRepository extends JpaRepository<IdeaDocumentEntity,Long> {

    List<IdeaDocumentEntity> findByIdeaId(Long ideaId);
}
