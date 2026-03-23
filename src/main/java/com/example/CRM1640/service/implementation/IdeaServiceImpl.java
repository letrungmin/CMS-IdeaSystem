package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.CreateIdeaRequest;
import com.example.CRM1640.dto.response.CommentPreviewResponse;
import com.example.CRM1640.dto.response.FileResponse;
import com.example.CRM1640.dto.response.IdeaDetailResponse;
import com.example.CRM1640.dto.response.IdeaResponse;
import com.example.CRM1640.entities.auth.TermsEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.idea.*;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.enums.FileType;
import com.example.CRM1640.enums.ReactionType;
import com.example.CRM1640.repositories.authen.TermsRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.authen.UserTermsAcceptanceRepository;
import com.example.CRM1640.repositories.idea.*;
import com.example.CRM1640.repositories.organization.AcademicYearRepository;
import com.example.CRM1640.service.interfaces.FilesStorageService;
import com.example.CRM1640.service.interfaces.IdeaService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IdeaServiceImpl implements IdeaService {

    private final IdeaRepository ideaRepository;
    private final AcademicYearRepository academicYearRepository;
    private final TermsRepository termsRepository;
    private final UserTermsAcceptanceRepository acceptanceRepository;
    private final CategoryRepository categoryRepository;
    private final IdeaCategoryRepository ideaCategoryRepository;
    private final UserRepository userRepository;
    private final ReactionRepository reactionRepository;
    private final FilesStorageService filesStorageService;
    private final IdeaDocumentRepository ideaDocumentRepository;
    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public IdeaResponse submitIdea(CreateIdeaRequest request,List<MultipartFile> files) {

        UserEntity user = getCurrentUser();

        // ================= Academic Year =================
        AcademicYearEntity academicYear = academicYearRepository
                .findFirstByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active academic year"));

        // ================= Check closure =================
        if (LocalDateTime.now().isAfter(academicYear.getIdeaClosureDate())) {
            throw new RuntimeException("Idea submission has been closed");
        }

        // ================= Get Terms =================
        TermsEntity terms = termsRepository
                .findByDepartmentIdAndAcademicYearIdAndActiveTrue(
                        user.getDepartment().getId(),
                        academicYear.getId()
                )
                .orElseThrow(() -> new RuntimeException("Terms not found"));

        // ================= Check accepted =================
        boolean accepted = acceptanceRepository
                .existsByUserIdAndTermsId(user.getId(), terms.getId());

        if (!accepted) {
            throw new RuntimeException("You must accept terms before submitting idea");
        }

        // ================= Create Idea =================
        IdeaEntity idea = new IdeaEntity();
        idea.setTitle(request.getTitle());
        idea.setContent(request.getContent());
        idea.setAnonymous(request.isAnonymous());
        idea.setAuthor(user);
        idea.setDepartment(user.getDepartment());
        idea.setAcademicYear(academicYear);
        idea.setCreatedAt(LocalDateTime.now());
        idea.setViewCount(0L);

        ideaRepository.save(idea);

        // ================= FILE =================
        List<IdeaDocumentEntity> documents = filesStorageService.saveFiles(files, idea);

        ideaDocumentRepository.saveAll(documents);


        // ================= Categories =================
        List<String> categoryNames = new ArrayList<>();

        for (Long categoryId : request.getCategoryIds()) {

            CategoryEntity category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            IdeaCategoryEntity ic = new IdeaCategoryEntity();
            ic.setIdea(idea);
            ic.setCategory(category);
            ic.setAssignedAt(LocalDateTime.now());

            ideaCategoryRepository.save(ic);

            categoryNames.add(category.getName());
        }

        // ================= Build Response =================
        return buildResponse(idea, categoryNames);
    }

    @Override
    @Transactional
    public IdeaDetailResponse getDetail(Long ideaId) {

        UserEntity user = getCurrentUser();

        // ✅ tăng view DB
        ideaRepository.increaseViewCount(ideaId);

        // ✅ load lại idea mới nhất
        IdeaEntity idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        // ================= AUTHOR =================
        String authorName = idea.isAnonymous()
                ? "Anonymous"
                : idea.getAuthor().getFirstName() + " " + idea.getAuthor().getLastName();

        Long authorId = idea.getAuthor().getId();
        String authorAvatar = idea.getAuthor().getAvatarUrl();

        // ================= CATEGORY =================
        List<String> categories = ideaRepository.findCategoryNamesByIdeaId(ideaId);

        // ================= REACTION =================
        List<Object[]> result = reactionRepository.countGroupByType(ideaId);

        Map<String, Long> reactionMap = new HashMap<>();
        long total = 0;

        for (Object[] row : result) {
            ReactionType type = (ReactionType) row[0];
            Long count = (Long) row[1];

            reactionMap.put(type.name(), count);
            total += count;
        }

        // ================= MY REACTION =================
        ReactionEntity myReactionEntity = reactionRepository
                .findByUserIdAndIdeaId(user.getId(), ideaId)
                .orElse(null);

        String myReaction = myReactionEntity != null
                ? myReactionEntity.getType().name()
                : "NONE";

        // ================= DOCUMENT =================
        List<String> images = new ArrayList<>();
        List<FileResponse> attachments = new ArrayList<>();

        if (idea.getDocuments() != null) {
            for (IdeaDocumentEntity doc : idea.getDocuments()) {

                if (doc.getType() == FileType.IMAGE) {
                    images.add(doc.getFileUrl());
                } else {
                    attachments.add(new FileResponse(
                            doc.getFileName(),
                            doc.getFileUrl(),
                            doc.getType().name()
                    ));
                }
            }
        }

        // ================= BUILD RESPONSE =================
        return new IdeaDetailResponse(
                idea.getId(),
                idea.getTitle(),
                idea.getContent(),
                idea.isAnonymous(),

                authorId,
                authorName,
                authorAvatar,

                idea.getDepartment().getName(),
                idea.getAcademicYear().getName(),

                idea.getViewCount(),
                idea.getCreatedAt(),

                categories,
                reactionMap,
                total,
                myReaction,

                idea.getCommentCount(),

                images,
                attachments
        );
    }

    // ================= RESPONSE =================
    private IdeaResponse buildResponse(IdeaEntity idea, List<String> categories) {

        String authorName = idea.isAnonymous()
                ? "Anonymous"
                : idea.getAuthor().getFirstName() + " " + idea.getAuthor().getLastName();

        return new IdeaResponse(
                idea.getId(),
                idea.getTitle(),
                idea.getContent(),
                idea.isAnonymous(),
                idea.getViewCount(),
                idea.getCreatedAt(),
                authorName,
                idea.getDepartment().getName(),
                idea.getAcademicYear().getName(),
                categories
        );
    }

    // ================= CURRENT USER =================
    private UserEntity getCurrentUser() {

        String username = "tes5tuser2"; // TODO: replace SecurityContext

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
