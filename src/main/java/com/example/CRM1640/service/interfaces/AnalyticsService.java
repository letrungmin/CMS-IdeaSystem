package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.response.AnalyticsOverviewResponse;
import com.example.CRM1640.dto.response.DepartmentIdeaResponse;
import com.example.CRM1640.dto.response.PrivacyResponse;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface AnalyticsService {

    public AnalyticsOverviewResponse getOverview();

    public List<DepartmentIdeaResponse> getIdeasByDepartment();

    public PrivacyResponse getPrivacy();

    void exportCsv(HttpServletResponse response) throws IOException;

    void exportZip(HttpServletResponse response) throws IOException;
}
