package com.example.CRM1640.controller;

import com.example.CRM1640.dto.request.CreateIdeaRequest;
import com.example.CRM1640.dto.response.IdeaDetailResponse;
import com.example.CRM1640.dto.response.IdeaResponse;
import com.example.CRM1640.service.interfaces.IdeaService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/idea")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IdeasController {
    private final IdeaService ideaService;

    @PostMapping(value = "/create",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IdeaResponse> submitIdea(
            @RequestPart("data")  @Valid CreateIdeaRequest request,
            @RequestPart(value = "image", required = false) List<MultipartFile> files
    ) {
        return ResponseEntity.ok(ideaService.submitIdea(request,files));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IdeaDetailResponse> getIdeaDetail(@PathVariable Long id){
        return ResponseEntity.ok(ideaService.getDetail(id));
    }


    @GetMapping
    public ResponseEntity<Page<IdeaDetailResponse>> getAllIdeas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ideaService.getAllIdeas(page, size));
    }

    // ================= MY IDEAS =================
    @GetMapping("/me")
    public ResponseEntity<Page<IdeaDetailResponse>> getMyIdeas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ideaService.getMyIdeas(page, size));
    }

}
