package com.example.CRM1640.service.implementation;

import com.example.CRM1640.config.FileConfigProperty;
import com.example.CRM1640.service.interfaces.FilesStorageService;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FilesStorageServiceImpl implements FilesStorageService {

    final FileConfigProperty fileConfigProperty;
    Path root;

    private static final int MAX_FILENAME_LENGTH = 100;
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "pdf");

    @PostConstruct
    private void initRootPath() {
        this.root = Paths.get(fileConfigProperty.getRootPath())
                .toAbsolutePath()
                .normalize();
    }

    @Override
    public void initFilesStorage() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    // ===============================
    // SAVE MULTIPLE FILES
    // ===============================
    @Override
    public List<String> save(List<MultipartFile> files, UUID uuid) {

        initFilesStorage();

        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("File list must not be empty");
        }

        List<String> storedNames = new ArrayList<>();

        for (MultipartFile file : files) {

            if (file.isEmpty()) {
                throw new IllegalArgumentException("File must not be empty");
            }

            String storedName = generateUniqueFileName(file, uuid);
            Path destination = root.resolve(storedName).normalize();

            // Security check (avoid path traversal)
            if (!destination.getParent().equals(root)) {
                throw new RuntimeException("Invalid file path");
            }

            try {
                Files.copy(
                        file.getInputStream(),
                        destination,
                        StandardCopyOption.REPLACE_EXISTING
                );
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file: " + storedName, e);
            }

            storedNames.add(storedName);
        }

        return storedNames;
    }

    // ===============================
    // LOAD FILE
    // ===============================
    @Override
    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found");
            }

        } catch (MalformedURLException e) {
            throw new RuntimeException("File not found", e);
        }
    }

    // ===============================
    // DELETE ALL
    // ===============================
    @Override
    public void deleteAll() {
        try (Stream<Path> paths = Files.walk(root)) {
            paths
                    .filter(path -> !path.equals(root))
                    .map(Path::toFile)
                    .forEach(File::delete);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete files", e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(root, 1)
                    .filter(path -> !path.equals(root))
                    .map(root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load files", e);
        }
    }

    // ===============================
    // HELPER METHODS
    // ===============================

    private String getOriginalFileName(MultipartFile file) {
        String filename = file.getOriginalFilename();

        if (filename == null || filename.isBlank()) {
            throw new IllegalArgumentException("Original file name must not be null or blank");
        }

        return Path.of(filename).getFileName().toString();
    }

    private String sanitizeFileName(String fileName) {

        String normalized = Normalizer.normalize(fileName, Normalizer.Form.NFKC);

        String safe = normalized.replaceAll("[^a-zA-Z0-9._-]", "_");

        return safe.length() > MAX_FILENAME_LENGTH
                ? safe.substring(safe.length() - MAX_FILENAME_LENGTH)
                : safe;
    }

    private String extractExtension(String fileName) {

        int dotIndex = fileName.lastIndexOf('.');

        if (dotIndex < 0 || dotIndex == fileName.length() - 1) {
            throw new IllegalArgumentException("File must have an extension");
        }

        String extension = fileName.substring(dotIndex + 1).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type not allowed: " + extension);
        }

        return extension;
    }

    private String generateUniqueFileName(MultipartFile file, UUID uuid) {

        String originalName = getOriginalFileName(file);
        String safeName = sanitizeFileName(originalName);
        String extension = extractExtension(safeName);

        return uuid + "_" + System.currentTimeMillis() + "." + extension;
    }
}



