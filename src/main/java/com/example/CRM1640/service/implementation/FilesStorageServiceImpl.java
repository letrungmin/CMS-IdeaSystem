package com.example.CRM1640.service.implementation;

import com.example.CRM1640.config.FileConfigProperty;
import com.example.CRM1640.entities.idea.IdeaDocumentEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.enums.FileType;
import com.example.CRM1640.exception.AppException;
import com.example.CRM1640.exception.ErrorCode;
import com.example.CRM1640.service.interfaces.FilesStorageService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import java.util.logging.Logger;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class FilesStorageServiceImpl implements FilesStorageService {

    private final FileConfigProperty config;

    private Path root;

    private static final int MAX_FILENAME_LENGTH = 120;

    // ================= INIT =================
    @PostConstruct
    public void init() {
        if (config.getRootPath() == null) {
            throw new AppException(ErrorCode.FILE_ROOT_PATH_NOT_CONFIG);
        }

        this.root = Paths.get(config.getRootPath())
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new AppException(ErrorCode.STORAGE_INIT_FAILED);
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
            throw new AppException(ErrorCode.FILE_SAVE_FAILED);
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
                throw new AppException(ErrorCode.TOTAL_SIZE_EXCEEDED);
            }

            FileType type = detectFileType(file.getOriginalFilename());
            Path folder = resolveFolder(type);

            String fileName = generateFileName(file);
            Path destination = folder.resolve(fileName).normalize();

            validatePath(destination, folder);

            try {
                Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                log.error("Save file failed: fileName={}, error={}", fileName, e.getMessage(), e);
                throw new AppException(ErrorCode.FILE_SAVE_FAILED);
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
                throw new AppException(ErrorCode.FILE_INVALID_PATH);
            }

            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new AppException(ErrorCode.FILE_NOT_FOUND);
            }

            return resource;

        } catch (MalformedURLException e) {
            throw new AppException(ErrorCode.FILE_LOAD_FAILED);
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
            throw new AppException(ErrorCode.FILE_DELETE_FAILED);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(root, 1)
                    .filter(p -> !p.equals(root))
                    .map(root::relativize);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_LOAD_FAILED);
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
            throw new AppException(ErrorCode.FILE_SAVE_FAILED);
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
            throw new AppException(ErrorCode.FOLDER_CREATE_FAILED);
        }

        return folder;
    }

    // ================= VALIDATION =================
    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_EMPTY);
        }

        long maxSize = parseSize(config.getMaxSize());
        if (file.getSize() > maxSize) {
            throw new  AppException(ErrorCode.FILE_TOO_LARGE);
        }

        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();

        // Check Mine if existing
        boolean validMime = contentType != null &&
                config.getAllowedTypes().contains(contentType);

        // check extension (fallback)
        boolean validExt = fileName != null && isAllowedExtension(fileName);

        if (!validMime && !validExt) {
            throw new AppException(ErrorCode.FILE_INVALID_TYPE);
        }
    }

    private boolean isAllowedExtension(String fileName) {

        String ext = getExtension(fileName);

        return switch (ext) {
            case "png", "jpg", "jpeg", "webp",
                 "pdf", "doc", "docx",
                 "xls", "xlsx",
                 "mp4", "mov", "avi", "mkv" -> true;
            default -> false;
        };
    }

    private void validatePath(Path path, Path folder) {
        if (!path.normalize().startsWith(folder)) {
            throw new AppException(ErrorCode.PATH_TRAVERSAL_ATTACK);
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

        if (fileName == null) throw new AppException(ErrorCode.INVALID_FILE_NAME);

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