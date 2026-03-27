package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.CategoryRequest;
import com.example.CRM1640.dto.response.CategoryResponse;
import com.example.CRM1640.entities.idea.CategoryEntity;
import com.example.CRM1640.repositories.idea.CategoryRepository;
import com.example.CRM1640.service.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    // ================= CREATE =================
    @Override
    public CategoryResponse create(CategoryRequest request) {

        if (categoryRepository.existsByName(request.name())) {
            throw new RuntimeException("Category already exists");
        }

        CategoryEntity entity = new CategoryEntity();
        entity.setName(request.name());
        entity.setActive(request.active() != null ? request.active() : true);

        return mapToResponse(categoryRepository.save(entity));
    }

    // ================= UPDATE =================
    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {

        CategoryEntity entity = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!entity.getName().equals(request.name())
                && categoryRepository.existsByName(request.name())) {
            throw new RuntimeException("Category name already exists");
        }

        entity.setName(request.name());

        if (request.active() != null) {
            entity.setActive(request.active());
        }

        return mapToResponse(categoryRepository.save(entity));
    }

    // ================= DELETE =================
    @Override
    public void delete(Long id) {

        CategoryEntity entity = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 👉 Soft delete
        entity.setActive(false);

        categoryRepository.save(entity);
    }

    // ================= GET =================
    @Override
    public CategoryResponse getById(Long id) {

        return categoryRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public List<CategoryResponse> getAll() {

        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CategoryResponse> getActive() {

        return categoryRepository.findAll()
                .stream()
                .filter(CategoryEntity::isActive)
                .map(this::mapToResponse)
                .toList();
    }

    // ================= MAPPER =================
    private CategoryResponse mapToResponse(CategoryEntity entity) {

        return new CategoryResponse(
                entity.getId(),
                entity.getName(),
                entity.isActive()
        );
    }
}
