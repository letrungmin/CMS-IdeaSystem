package com.example.CRM1640.controller;

import com.example.CRM1640.dto.request.AcademicYearRequest;
import com.example.CRM1640.dto.response.AcademicYearResponse;
import com.example.CRM1640.service.interfaces.AcademicYearService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/academic-years")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AcademicYearController {
    AcademicYearService service;

    // Admin
    @PostMapping
    public AcademicYearResponse create(@Valid @RequestBody AcademicYearRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public AcademicYearResponse update(
            @PathVariable Long id,
            @Valid @RequestBody AcademicYearRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}")
    public AcademicYearResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<AcademicYearResponse> getAll() {
        return service.getAll();
    }

    // User dùng để load dropdown
    @GetMapping("/active")
    public List<AcademicYearResponse> getActiveYears() {
        return service.getActiveYears();
    }
}
