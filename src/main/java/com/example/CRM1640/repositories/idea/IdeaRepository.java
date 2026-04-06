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
}
