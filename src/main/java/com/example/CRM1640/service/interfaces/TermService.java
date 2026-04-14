package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.AcceptTermsRequest;
import com.example.CRM1640.dto.request.TermsRequest;
import com.example.CRM1640.dto.response.TermsResponse;
import com.example.CRM1640.dto.response.TermsStatusResponse;
import java.util.List;

public interface TermService {
    TermsStatusResponse getMyTermsStatus();

    void acceptTerms(AcceptTermsRequest request);

    TermsResponse create(TermsRequest request);

    TermsResponse update(Long id, TermsRequest request);

    TermsResponse publish(Long id);

    List<TermsResponse> getByAcademicYear(Long academicYearId);
}
