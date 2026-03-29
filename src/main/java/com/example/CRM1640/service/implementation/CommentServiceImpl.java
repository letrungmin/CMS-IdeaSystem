package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.CreateCommentRequest;
import com.example.CRM1640.dto.response.CommentResponse;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.idea.CommentEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.entities.idea.ReactionEntity;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.enums.ReactionType;
import com.example.CRM1640.exception.AppException;
import com.example.CRM1640.exception.ErrorCode;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.idea.CommentRepository;
import com.example.CRM1640.repositories.idea.IdeaRepository;
import com.example.CRM1640.repositories.idea.ReactionRepository;
import com.example.CRM1640.repositories.organization.AcademicYearRepository;
import com.example.CRM1640.service.interfaces.CommentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    private final ReactionRepository reactionRepository;
    private final AcademicYearRepository academicYearRepository;

    // ================= CREATE =================
    @Override
    @Transactional
    public CommentResponse create(CreateCommentRequest request) {

        UserEntity user = getCurrentUser();

        IdeaEntity idea = ideaRepository.findById(request.ideaId())
                .orElseThrow(() -> new AppException(ErrorCode.IDEA_NOT_FOUND));

        // ================= CHECK FINAL CLOSURE =================

        AcademicYearEntity academicYear = academicYearRepository
                .findFirstByActiveTrue()
                .orElseThrow(() -> new AppException(ErrorCode.NON_ACTIVATE_ACADEMY_YEAR));

        if (LocalDateTime.now().isAfter(academicYear.getFinalClosureDate())) {
            throw new AppException(ErrorCode.COMMENT_EXPIRED);
        }

        CommentEntity parent = null;

        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_COMMENT_NOT_FOUND));

            if (!parent.getIdea().getId().equals(idea.getId())) {
                throw new AppException(ErrorCode.INVALID_COMMENT_PARENT);
            }
        }

        CommentEntity comment = new CommentEntity();
        comment.setContent(request.content());
        comment.setAnonymous(request.anonymous());
        comment.setAuthor(user);
        comment.setIdea(idea);
        comment.setParent(parent);

        commentRepository.save(comment);

        idea.setCommentCount(idea.getCommentCount() + 1);

        if (parent != null) {
            parent.setReplyCount(parent.getReplyCount() + 1);
        }

        return mapToResponse(comment, List.of());
    }

    // ================= ROOT COMMENTS =================
    @Override
    public Page<CommentResponse> getRootComments(Long ideaId, int page, int size, String sort) {

        Pageable pageable = PageRequest.of(page, size, getSort(sort));

        return commentRepository
                .findByIdeaIdAndParentIsNull(ideaId, pageable)
                .map(c -> mapToResponse(c, List.of())); // lazy replies
    }

    // ================= REPLIES =================
    @Override
    public List<CommentResponse> getReplies(Long commentId) {

        List<CommentEntity> replies = commentRepository.findByParentId(commentId);

        return replies.stream()
                .map(c -> mapToResponse(c, List.of()))
                .toList();
    }

    // ================= SORT =================
    private Sort getSort(String sort) {

        return switch (sort) {
            case "oldest" -> Sort.by("createdAt").ascending();
            case "most_liked" -> Sort.by("likeCount").descending();
            default -> Sort.by("createdAt").descending();
        };
    }

    // ================= MAPPER =================
    private CommentResponse mapToResponse(CommentEntity c, List<CommentResponse> replies) {

        UserEntity currentUser = getCurrentUser();

        // ================= AUTHOR =================
        String authorName = c.isAnonymous()
                ? "Anonymous"
                : c.getAuthor().getFirstName() + " " + c.getAuthor().getLastName();

        // ================= REACTION MAP =================
        List<Object[]> result = reactionRepository.countGroupByComment(c.getId());

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
                .findByCommentIdAndUserId(c.getId(), currentUser.getId())
                .orElse(null);

        String myReaction = myReactionEntity != null
                ? myReactionEntity.getType().name()
                : "NONE";

        // ================= BUILD =================
        return new CommentResponse(
                c.getId(),
                c.getContent(),
                authorName,
                c.isAnonymous(),
                c.getCreatedAt(),

                c.getReplyCount(),

                reactionMap,
                total,
                myReaction,

                replies
        );
    }

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
