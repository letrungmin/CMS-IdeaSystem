package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.AcceptTermsRequest;
import com.example.CRM1640.dto.response.TermsStatusResponse;

public interface TermService {
    TermsStatusResponse getMyTermsStatus();

    void acceptTerms(AcceptTermsRequest request);
}
