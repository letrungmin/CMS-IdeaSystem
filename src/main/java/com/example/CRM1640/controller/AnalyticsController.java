package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.response.AnalyticsOverviewResponse;
import com.example.CRM1640.dto.response.DepartmentIdeaResponse;
import com.example.CRM1640.dto.response.PrivacyResponse;
import com.example.CRM1640.service.interfaces.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    // ================= OVERVIEW =================
    @GetMapping("/overview")
    public ApiResponse<AnalyticsOverviewResponse> overview(HttpServletRequest req) {
        return ApiResponse.<AnalyticsOverviewResponse>builder()
                .result(analyticsService.getOverview())
                .message("Overview success")
                .path(req.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= DEPARTMENT =================
    @GetMapping("/departments")
    public ApiResponse<List<DepartmentIdeaResponse>> departments(HttpServletRequest req) {
        return ApiResponse.<List<DepartmentIdeaResponse>>builder()
                .result(analyticsService.getIdeasByDepartment())
                .message("Department analytics success")
                .path(req.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    // ================= PRIVACY =================
    @GetMapping("/privacy")
    public ApiResponse<PrivacyResponse> privacy(HttpServletRequest req) {
        return ApiResponse.<PrivacyResponse>builder()
                .result(analyticsService.getPrivacy())
                .message("Privacy analytics success")
                .path(req.getRequestURI())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    @GetMapping("/export")
    public void export(HttpServletResponse response) throws IOException {
        analyticsService.exportCsv(response);
    }

    @GetMapping("/export/zip")
    public void exportZip(HttpServletResponse response) throws IOException {
        analyticsService.exportZip(response);
    }


}
