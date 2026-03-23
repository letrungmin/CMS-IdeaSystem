package com.example.CRM1640.config;

import lombok.Data;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;


@ConfigurationProperties(prefix = "file")
@Data
public class FileConfigProperty {

    private String rootPath;
    private String tempFolder;

    private String maxSize;
    private String maxTotalSize;

    private List<String> allowedTypes;

    private String storageType;

    private boolean enableVersioning;
    private int keepDays;
    private boolean encrypt;
}