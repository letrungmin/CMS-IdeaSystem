package com.example.CRM1640.repositories.idea;

import com.example.CRM1640.entities.idea.IdeaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}
