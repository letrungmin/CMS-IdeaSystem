package com.example.CRM1640.controller;

import com.example.CRM1640.service.interfaces.FilesStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileStreamController {
    private final FilesStorageService filesStorageService;

    // ================= STREAM FILE =================
    @GetMapping("/{type}/{filename}")
    public ResponseEntity<Resource> streamFile(
            @PathVariable String type,
            @PathVariable String filename
    ) {

        Resource resource = filesStorageService.load(type + "/" + filename);

        String contentType = detectContentType(filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }

    // ================= DOWNLOAD FILE =================
    @GetMapping("/download/{type}/{filename}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String type,
            @PathVariable String filename
    ) {

        Resource resource = filesStorageService.load(type + "/" + filename);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    // ================= HELPER =================
    private String detectContentType(String filename) {

        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        return switch (ext) {
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "webp" -> "image/webp";
            case "pdf" -> "application/pdf";
            case "doc", "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls", "xlsx" -> "application/vnd.ms-excel";
            default -> "application/octet-stream";
        };
    }
}
