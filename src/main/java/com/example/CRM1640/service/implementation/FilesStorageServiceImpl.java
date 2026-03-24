package com.example.CRM1640.service.implementation;

import com.example.CRM1640.config.FileConfigProperty;
import com.example.CRM1640.entities.idea.IdeaDocumentEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.enums.FileType;
import com.example.CRM1640.service.interfaces.FilesStorageService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class FilesStorageServiceImpl implements FilesStorageService {

    private final FileConfigProperty config;

    private Path root;

    private static final int MAX_FILENAME_LENGTH = 120;

    // ================= INIT =================
    @PostConstruct
    public void init() {
        if (config.getRootPath() == null) {
            throw new RuntimeException("File root path not configured!");
        }

        this.root = Paths.get(config.getRootPath())
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Cannot init storage", e);
        }
    }

    @Override
    public String saveAvatar(MultipartFile file, String userUuid) {

        validateFile(file);

        Path folder = root.resolve("avatar");

        try {
            Files.createDirectories(folder);

            String fileName = generateAvatarFileName(file, userUuid);
            Path destination = folder.resolve(fileName).normalize();

            validatePath(destination, folder);

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            return "/files/avatar/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Save avatar failed", e);
        }
    }

    private String generateAvatarFileName(MultipartFile file, String userUuid) {

        String original = sanitize(file.getOriginalFilename());
        String ext = getExtension(original);

        String baseName = original.replace("." + ext, "");

        return "avatar_" + userUuid + "_" + System.currentTimeMillis() + "." + ext;
    }

    // ================= SAVE FILE =================
    @Override
    public List<IdeaDocumentEntity> saveFiles(List<MultipartFile> files, IdeaEntity idea) {

        if (files == null || files.isEmpty()) return List.of();

        long totalSize = 0;
        List<IdeaDocumentEntity> result = new ArrayList<>();

        for (MultipartFile file : files) {

            validateFile(file);

            totalSize += file.getSize();
            if (totalSize > parseSize(config.getMaxTotalSize())) {
                throw new IllegalArgumentException("Total upload exceeded limit");
            }

            FileType type = detectFileType(file.getOriginalFilename());
            Path folder = resolveFolder(type);

            String fileName = generateFileName(file);
            Path destination = folder.resolve(fileName).normalize();

            validatePath(destination, folder);

            try {
                Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new RuntimeException("Save file failed: " + fileName, e);
            }

            IdeaDocumentEntity doc = new IdeaDocumentEntity();
            doc.setFileName(fileName);
            doc.setFileUrl("/files/" + folder.getFileName() + "/" + fileName);
            doc.setType(type);
            doc.setSize(file.getSize());
            doc.setIdea(idea);

            result.add(doc);
        }

        return result;
    }

    // ================= LOAD =================
    @Override
    public Resource load(String path) {
        try {
            Path file = root.resolve(path).normalize();

            if (!file.startsWith(root)) {
                throw new RuntimeException("Invalid path");
            }

            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not found");
            }

            return resource;

        } catch (MalformedURLException e) {
            throw new RuntimeException("Load file error", e);
        }
    }

    // ================= DELETE =================
    @Override
    public void deleteAll() {
        try (Stream<Path> paths = Files.walk(root)) {
            paths
                    .filter(path -> !path.equals(root))
                    .forEach(path -> path.toFile().delete());
        } catch (IOException e) {
            throw new RuntimeException("Delete failed", e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(root, 1)
                    .filter(p -> !p.equals(root))
                    .map(root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Load all failed", e);
        }
    }

    // ================= AVATAR =================
    @Override
    public String saveAvatar(MultipartFile file) {

        validateFile(file);

        Path folder = root.resolve("avatar");

        try {
            Files.createDirectories(folder);

            String fileName = generateFileName(file);
            Path destination = folder.resolve(fileName);

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            return "/files/avatar/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Save avatar failed", e);
        }
    }

    // ================= FOLDER =================
    private Path resolveFolder(FileType type) {

        String folderName = switch (type) {
            case IMAGE -> "image";
            case VIDEO -> "video";
            case PDF -> "pdf";
            case WORD -> "word";
            case EXCEL -> "excel";
            default -> "other";
        };

        Path folder = root.resolve(folderName);

        try {
            Files.createDirectories(folder);
        } catch (IOException e) {
            throw new RuntimeException("Cannot create folder", e);
        }

        return folder;
    }

    // ================= VALIDATION =================
    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File empty");
        }

        long maxSize = parseSize(config.getMaxSize());

        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File too large");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !config.getAllowedTypes().contains(contentType)) {
            throw new IllegalArgumentException("Invalid MIME type: " + contentType);
        }
    }

    private void validatePath(Path path, Path folder) {
        if (!path.normalize().startsWith(folder)) {
            throw new RuntimeException("Path traversal attack");
        }
    }

    // ================= FILE NAME =================
    private String generateFileName(MultipartFile file) {

        String original = sanitize(file.getOriginalFilename());
        String ext = getExtension(original);

        String baseName = original.replace("." + ext, "");

        return baseName + "_" + System.currentTimeMillis() + "." + ext;
    }

    private String sanitize(String fileName) {

        if (fileName == null) throw new IllegalArgumentException("Invalid name");

        String normalized = Normalizer.normalize(fileName, Normalizer.Form.NFKC);

        String safe = normalized.replaceAll("[^a-zA-Z0-9._-]", "_");

        return safe.length() > MAX_FILENAME_LENGTH
                ? safe.substring(0, MAX_FILENAME_LENGTH)
                : safe;
    }

    private String getExtension(String fileName) {

        int dot = fileName.lastIndexOf('.');
        if (dot < 0) return "bin";

        return fileName.substring(dot + 1).toLowerCase();
    }

    // ================= FILE TYPE =================
    private FileType detectFileType(String filename) {

        if (filename == null) return FileType.OTHER;

        String ext = getExtension(filename);

        return switch (ext) {
            case "jpg", "jpeg", "png", "gif", "webp" -> FileType.IMAGE;
            case "mp4", "mov", "avi", "mkv" -> FileType.VIDEO;
            case "pdf" -> FileType.PDF;
            case "doc", "docx" -> FileType.WORD;
            case "xls", "xlsx" -> FileType.EXCEL;
            default -> FileType.OTHER;
        };
    }

    // ================= SIZE PARSER =================
    private long parseSize(String size) {

        if (size == null) return 0;

        size = size.trim().toUpperCase();

        if (size.endsWith("KB")) return Long.parseLong(size.replace("KB", "")) * 1024;
        if (size.endsWith("MB")) return Long.parseLong(size.replace("MB", "")) * 1024 * 1024;
        if (size.endsWith("GB")) return Long.parseLong(size.replace("GB", "")) * 1024 * 1024 * 1024;

        return Long.parseLong(size);
    }
}