package com.example.CRM1640.controller;

import com.example.CRM1640.service.interfaces.FilesStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileStreamController {

    private final FilesStorageService filesStorageService;

    // ================= STREAM FILE =================
    @GetMapping("/{type}/{filename:.+}")
    public ResponseEntity<Resource> streamFile(
            @PathVariable String type,
            @PathVariable String filename
    ) {

        validateFileName(filename);

        String fullPath = type + "/" + filename;
        Resource resource = filesStorageService.load(fullPath);

        String contentType = detectContentType(resource, filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .header(HttpHeaders.ACCEPT_RANGES, "bytes") // 🔥 support video seek
                .body(resource);
    }

    // ================= DOWNLOAD FILE =================
    @GetMapping("/download/{type}/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String type,
            @PathVariable String filename
    ) {

        validateFileName(filename);

        String fullPath = type + "/" + filename;
        Resource resource = filesStorageService.load(fullPath);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    // ================= HELPER =================

    private void validateFileName(String filename) {
        if (!StringUtils.hasText(filename) || filename.contains("..")) {
            throw new RuntimeException("Invalid file name");
        }
    }

    private String detectContentType(Resource resource, String filename) {

        try {
            Path path = resource.getFile().toPath();
            String contentType = Files.probeContentType(path);

            if (contentType != null) {
                return contentType;
            }

        } catch (Exception ignored) {}

        // fallback
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        return switch (ext) {
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "webp" -> "image/webp";
            case "mp4" -> "video/mp4";        // 🔥 video support
            case "mov" -> "video/quicktime";
            case "pdf" -> "application/pdf";
            case "doc", "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls", "xlsx" -> "application/vnd.ms-excel";
            default -> "application/octet-stream";
        };
    }
}