package com.example.CRM1640.repositories.idea;

import com.example.CRM1640.entities.idea.ReactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ReactionRepository extends JpaRepository<ReactionEntity,Long> {
    // Find existing reaction of user for an idea
    Optional<ReactionEntity> findByUserIdAndIdeaId(Long userId, Long ideaId);

    // Count reactions grouped by type
    @Query("""
        SELECT r.type, COUNT(r)
        FROM ReactionEntity r
        WHERE r.idea.id = :ideaId
        GROUP BY r.type
    """)
    List<Object[]> countGroupByType(Long ideaId);

    // ===== COMMENT =====
    Optional<ReactionEntity> findByCommentIdAndUserId(Long commentId, Long userId);

    List<ReactionEntity> findByCommentId(Long commentId);

    // count per type (optional - advanced)
    @Query("""
        SELECT r.type, COUNT(r)
        FROM ReactionEntity r
        WHERE r.comment.id = :commentId
        GROUP BY r.type
    """)
    List<Object[]> countByCommentGroupByType(Long commentId);
}
