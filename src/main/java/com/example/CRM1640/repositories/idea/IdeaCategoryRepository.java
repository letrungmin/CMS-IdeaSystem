package com.example.CRM1640.repositories.idea;

import com.example.CRM1640.entities.idea.IdeaCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdeaCategoryRepository extends JpaRepository<IdeaCategoryEntity,Long> {
}
