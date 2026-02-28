package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.AcademicYearRequest;
import com.example.CRM1640.dto.response.AcademicYearResponse;

import java.util.List;

public interface AcademicYearService {
    AcademicYearResponse create(AcademicYearRequest request);

    AcademicYearResponse update(Long id, AcademicYearRequest request);

    void delete(Long id);

    AcademicYearResponse getById(Long id);

    List<AcademicYearResponse> getAll();

    List<AcademicYearResponse> getActiveYears();
}
