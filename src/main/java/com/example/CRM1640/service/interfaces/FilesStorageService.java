package com.example.CRM1640.service.interfaces;

import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FilesStorageService {
    public void initFilesStorage();


        List<String> save(List<MultipartFile> files, UUID uuid);

        default String save(MultipartFile file, UUID uuid) {
            List<String> results = save(List.of(file), uuid);
            if (results.isEmpty()) {
                throw new IllegalStateException("File saving failed");
            }
            return results.get(0);        }

    public Resource load(String filename);

    public void deleteAll();

    public Stream<Path> loadAll();
}
