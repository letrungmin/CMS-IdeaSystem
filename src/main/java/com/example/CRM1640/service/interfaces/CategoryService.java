package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.CategoryRequest;
import com.example.CRM1640.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {


    CategoryResponse create(CategoryRequest request);

    CategoryResponse update(Long id, CategoryRequest request);

    void delete(Long id);

    CategoryResponse getById(Long id);

    List<CategoryResponse> getAll();

    List<CategoryResponse> getActive();
}
