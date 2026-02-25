package com.example.CRM1640.service.interfaces;

import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FilesStorageService {
    public void initFilesStorage();

    public List<String> save(List<MultipartFile> file, UUID uuid);

    public Resource load(String filename);

    public void deleteAll();

    public Stream<Path> loadAll();
}
