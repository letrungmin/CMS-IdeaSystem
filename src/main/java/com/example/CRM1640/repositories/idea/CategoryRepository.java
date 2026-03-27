package com.example.CRM1640.repositories.idea;

import com.example.CRM1640.entities.idea.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {

    Optional<CategoryEntity> findByName(String name);

    boolean existsByName(String name);
}
