package com.example.CRM1640.service.interfaces;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;
import com.example.CRM1640.entities.idea.IdeaDocumentEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FilesStorageService {
    public void initFilesStorage();


    List<IdeaDocumentEntity> saveFiles(List<MultipartFile> files, IdeaEntity idea);

    Resource load(String filename);

    public void deleteAll();

    public Stream<Path> loadAll();

    public String saveAvatar(MultipartFile file);
}
