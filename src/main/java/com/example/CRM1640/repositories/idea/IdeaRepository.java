package com.example.CRM1640.repositories.idea;

import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.enums.IdeaStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IdeaRepository extends JpaRepository<IdeaEntity,Long> {
    @Query("""
    SELECT c.name
    FROM IdeaCategoryEntity ic
    JOIN ic.category c
    WHERE ic.idea.id = :ideaId
""")
    List<String> findCategoryNamesByIdeaId(Long ideaId);


    @Modifying
    @Query("UPDATE IdeaEntity i SET i.viewCount = i.viewCount + 1 WHERE i.id = :id")
    void increaseViewCount(@Param("id") Long id);

    Page<IdeaEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<IdeaEntity> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    List<IdeaEntity> findByStatus(IdeaStatus status);


    Page<IdeaEntity> findByStatus(IdeaStatus status, Pageable pageable);

    Page<IdeaEntity> findByAuthorAndStatus(
            UserEntity author,
            IdeaStatus status,
            Pageable pageable
    );

    @Query("""
    SELECT COUNT(i)
    FROM IdeaEntity i
    WHERE i.author.id = :userId
      AND i.status = com.example.CRM1640.enums.IdeaStatus.APPROVED
""")
    Long countApprovedIdeasByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(i) FROM IdeaEntity i")
    Long countAllIdeas();

    @Query("""
    SELECT COUNT(r) * 1.0 / COUNT(DISTINCT i.id)
    FROM ReactionEntity r
    JOIN r.idea i
""")
    Double avgReactions();

    @Query("""
    SELECT d.name, COUNT(i)
    FROM IdeaEntity i
    JOIN i.department d
    GROUP BY d.name
""")
    List<Object[]> countIdeasByDepartment();

    @Query("""
    SELECT 
        SUM(CASE WHEN i.anonymous = false THEN 1 ELSE 0 END),
        SUM(CASE WHEN i.anonymous = true THEN 1 ELSE 0 END)
    FROM IdeaEntity i
""")
    List<Object[]> countPrivacy();
}
