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
import com.example.CRM1640.entities.other.IdeaEvent;
import com.example.CRM1640.enums.FileType;
import com.example.CRM1640.enums.IdeaEventType;
import com.example.CRM1640.enums.IdeaStatus;
import com.example.CRM1640.enums.ReactionType;
import com.example.CRM1640.exception.AppException;
import com.example.CRM1640.exception.ErrorCode;
import com.example.CRM1640.repositories.authen.TermsRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.authen.UserTermsAcceptanceRepository;
import com.example.CRM1640.repositories.idea.*;
import com.example.CRM1640.repositories.organization.AcademicYearRepository;
import com.example.CRM1640.service.interfaces.FilesStorageService;
import com.example.CRM1640.service.interfaces.IdeaService;
import com.example.CRM1640.service.interfaces.RabbitMQProducer;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final RabbitMQProducer rabbitMQProducer;

    @Override
    @Transactional
    public IdeaResponse submitIdea(CreateIdeaRequest request,List<MultipartFile> files) {

        UserEntity user = getCurrentUser();


        // ================= Academic Year =================
        AcademicYearEntity academicYear = academicYearRepository
                .findFirstByActiveTrue()
                .orElseThrow(() -> new AppException(ErrorCode.NON_ACTIVATE_ACADEMY_YEAR));

        // ================= Check closure =================
        if (LocalDateTime.now().isAfter(academicYear.getIdeaClosureDate())) {
            throw new AppException(ErrorCode.IDEA_SUBMIT_EXPIRED);
        }

        // ================= Get Terms =================
        TermsEntity terms = termsRepository
                .findByDepartmentIdAndAcademicYearIdAndActiveTrue(
                        user.getDepartment().getId(),
                        academicYear.getId()
                )
                .orElseThrow(() -> new AppException(ErrorCode.TERM_NOT_FOUND));

        // ================= Check accepted =================
        boolean accepted = acceptanceRepository
                .existsByUserIdAndTermsId(user.getId(), terms.getId());

        if (!accepted) {
            throw new AppException(ErrorCode.MUST_ACCEPT_TERM);
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
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

            IdeaCategoryEntity ic = new IdeaCategoryEntity();
            ic.setIdea(idea);
            ic.setCategory(category);
            ic.setAssignedAt(LocalDateTime.now());

            ideaCategoryRepository.save(ic);

            categoryNames.add(category.getName());
        }

        rabbitMQProducer.send(
                IdeaEvent.builder()
                        .ideaId(idea.getId())
                        .title(idea.getTitle())
                        .content(idea.getContent())
                        .authorEmail(user.getEmail())
                        .authorName(user.getUsername())
                        .qaManagerEmail(user.getDepartment().getQaCoordinator().getEmail())
                        .type(IdeaEventType.SUBMITTED)
                        .build()
        );


        // ================= Build Response =================
        return buildResponse(idea, categoryNames);
    }

    @Override
    @Transactional
    public IdeaDetailResponse getDetail(Long ideaId) {

        UserEntity user = getCurrentUser();

        // Increase View In DB
        ideaRepository.increaseViewCount(ideaId);

        // Load the latest Idea again
        IdeaEntity idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new AppException(ErrorCode.IDEA_NOT_FOUND));

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
                    images.add("/api/v1"+doc.getFileUrl());
                } else {
                    attachments.add(new FileResponse(
                            "/api/v1"+doc.getFileName(),
                            "/api/v1"+doc.getFileUrl(),
                            "/api/v1"+doc.getType().name()
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
                attachments,
                idea.getStatus().name()
        );
    }

    @Override
    public Page<IdeaDetailResponse> getAllIdeas(int page, int size) {

        UserEntity user = getCurrentUser();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return ideaRepository
                .findByStatus(IdeaStatus.APPROVED, pageable)
                .map(idea -> buildFullResponse(idea, user));
    }

    @Override
    public Page<IdeaDetailResponse> getAllPending(int page, int size) {

        UserEntity user = getCurrentUser();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return ideaRepository
                .findByStatus(IdeaStatus.PENDING, pageable)
                .map(idea -> buildFullResponse(idea, user));
    }


    @Override
    public Page<IdeaDetailResponse> getAllIReject(int page, int size) {

        UserEntity user = getCurrentUser();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return ideaRepository
                .findByStatus(IdeaStatus.REJECTED, pageable)
                .map(idea -> buildFullResponse(idea, user));
    }

    @Override
    public Page<IdeaDetailResponse> getAllStatusIdeas(int page, int size) {

        UserEntity user = getCurrentUser();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return ideaRepository.findAll(pageable)
                .map(idea -> buildFullResponse(idea, user));
    }

    @Override
    public Page<IdeaDetailResponse> getMyIdeas(int page, int size) {

        UserEntity user = getCurrentUser();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return ideaRepository
                .findByAuthorIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(idea -> buildFullResponse(idea, user));
    }

    @Override
    @Transactional
    public void approve(Long ideaId) {

        IdeaEntity idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new AppException(ErrorCode.IDEA_NOT_FOUND));

        idea.setStatus(IdeaStatus.APPROVED);
        idea.setApprovedAt(LocalDateTime.now());
        idea.setApprovedBy(getCurrentUser());

        rabbitMQProducer.send(
                IdeaEvent.builder()
                        .ideaId(idea.getId())
                        .title(idea.getTitle())
                        .authorEmail(idea.getAuthor().getEmail())
                        .authorName(idea.getAuthor().getUsername())
                        .type(IdeaEventType.APPROVED)
                        .build()
        );
    }

    @Override
    @Transactional
    public void reject(Long ideaId, String feedback) {

        IdeaEntity idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new AppException(ErrorCode.IDEA_NOT_FOUND));

        idea.setStatus(IdeaStatus.REJECTED);
        idea.setFeedback(feedback);
        idea.setApprovedBy(getCurrentUser());

        rabbitMQProducer.send(
                IdeaEvent.builder()
                        .ideaId(idea.getId())
                        .title(idea.getTitle())
                        .authorEmail(idea.getAuthor().getEmail())
                        .authorName(idea.getAuthor().getUsername())
                        .feedback(idea.getFeedback())
                        .type(IdeaEventType.REJECTED)
                        .build()
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


    private IdeaDetailResponse buildFullResponse(IdeaEntity idea, UserEntity currentUser) {

        // ================= AUTHOR =================
        String authorName = idea.isAnonymous()
                ? "Anonymous"
                : idea.getAuthor().getFirstName() + " " + idea.getAuthor().getLastName();

        Long authorId = idea.getAuthor().getId();
        String authorAvatar = idea.getAuthor().getAvatarUrl();

        // ================= CATEGORY =================
        List<String> categories = ideaRepository.findCategoryNamesByIdeaId(idea.getId());

        // ================= REACTION =================
        List<Object[]> result = reactionRepository.countGroupByType(idea.getId());

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
                .findByUserIdAndIdeaId(currentUser.getId(), idea.getId())
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
                    images.add("/api/v1" + doc.getFileUrl());
                } else {
                    attachments.add(new FileResponse(
                            doc.getFileName(),
                            "/api/v1" + doc.getFileUrl(),
                            doc.getType().name()
                    ));
                }
            }
        }

        // ================= BUILD =================
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
                attachments,
                idea.getStatus().name()
        );
    }

    // ================= CURRENT USER =================
    private UserEntity getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}
