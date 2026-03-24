package com.example.CRM1640.dto.response;

import com.example.CRM1640.enums.FileType;

public record StoredFileInfo(
        String fileName,
        String url,
        FileType type,
        Long size
) {}
