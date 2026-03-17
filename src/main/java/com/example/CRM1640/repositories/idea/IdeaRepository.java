package com.example.CRM1640.repositories.idea;

import com.example.CRM1640.entities.idea.IdeaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdeaRepository extends JpaRepository<IdeaEntity,Long> {
}
