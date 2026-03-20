package com.example.CRM1640.repositories.idea;

import com.example.CRM1640.entities.idea.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    // root comments
    Page<CommentEntity> findByIdeaIdAndParentIsNull(Long ideaId, Pageable pageable);

    // replies
    List<CommentEntity> findByParentId(Long parentId);

    // find by id + idea (safe check)
    Optional<CommentEntity> findByIdAndIdeaId(Long id, Long ideaId);
}
