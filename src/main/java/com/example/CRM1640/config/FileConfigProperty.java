package com.example.CRM1640.config;

import lombok.Data;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@ConfigurationProperties(prefix = "file.image") // get all variable starting with file.image in .properties file
@Data
@ToString
public class FileConfigProperty {
    private String rootPath;
    private String tempFolder;
    private String maxSize;
    private List<String> allowedTypes;
    private String maxTotalSize;
    private boolean enableVersioning;
    private int keepDays;
    private boolean encrypt;
}
