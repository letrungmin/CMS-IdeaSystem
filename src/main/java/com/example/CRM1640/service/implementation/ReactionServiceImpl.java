package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.ReactCommentRequest;
import com.example.CRM1640.dto.request.ReactionRequest;
import com.example.CRM1640.dto.response.ReactionResponse;
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
import com.example.CRM1640.service.interfaces.ReactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReactionServiceImpl implements ReactionService {

    private final ReactionRepository reactionRepository;
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final AcademicYearRepository academicYearRepository;

    // ================= IDEA REACTION =================
    @Override
    @Transactional
    public ReactionResponse react(ReactionRequest request) {

        UserEntity user = getCurrentUser();

        // ================= CHECK FINAL CLOSURE =================

        AcademicYearEntity academicYear = academicYearRepository
                .findFirstByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active academic year"));

        if (LocalDateTime.now().isAfter(academicYear.getFinalClosureDate())) {
            throw new RuntimeException("Reaction Idea period has ended");
        }

        IdeaEntity idea = ideaRepository.findById(request.getIdeaId())
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        ReactionType newType = request.getType();

        ReactionEntity existing = reactionRepository
                .findByUserIdAndIdeaId(user.getId(), idea.getId())
                .orElse(null);

        handleReaction(
                existing,
                newType,

                // CREATE
                () -> {
                    ReactionEntity r = new ReactionEntity();
                    r.setUser(user);
                    r.setIdea(idea);
                    r.setType(newType);
                    reactionRepository.save(r);

                    increaseCount(idea, newType);
                },

                // DELETE (toggle off)
                () -> {
                    reactionRepository.delete(existing);
                    decreaseCount(idea, existing.getType());
                },

                // UPDATE (change type)
                () -> {
                    decreaseCount(idea, existing.getType());
                    existing.setType(newType);
                    reactionRepository.save(existing);
                    increaseCount(idea, newType);
                }
        );

        return buildIdeaResponse(user.getId(), idea.getId());
    }

    // ================= COMMENT REACTION =================
    @Override
    @Transactional
    public ReactionResponse reactComment(ReactCommentRequest request) {

        UserEntity user = getCurrentUser();


        // ================= CHECK FINAL CLOSURE =================

        AcademicYearEntity academicYear = academicYearRepository
                .findFirstByActiveTrue()
                .orElseThrow(() -> new AppException(ErrorCode.NON_ACTIVATE_ACADEMY_YEAR));

        if (LocalDateTime.now().isAfter(academicYear.getFinalClosureDate())) {
            throw new AppException(ErrorCode.REACTION_COMMENT_EXPIRED);
        }

        CommentEntity comment = commentRepository.findById(request.commentId())
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        ReactionEntity existing = reactionRepository
                .findByCommentIdAndUserId(comment.getId(), user.getId())
                .orElse(null);

        ReactionType newType = request.type();

        handleReaction(
                existing,
                newType,

                // CREATE
                () -> {
                    ReactionEntity r = new ReactionEntity();
                    r.setUser(user);
                    r.setComment(comment);
                    r.setType(newType);
                    reactionRepository.save(r);

                    comment.setLikeCount(comment.getLikeCount() + 1);
                },

                // DELETE
                () -> {
                    reactionRepository.delete(existing);
                    comment.setLikeCount(Math.max(0, comment.getLikeCount() - 1));
                },

                // UPDATE
                () -> {
                    existing.setType(newType);
                    reactionRepository.save(existing);
                }
        );

        return buildCommentResponse(user.getId(), comment.getId());
    }

    // ================= CORE LOGIC (REUSE) =================
    private void handleReaction(
            ReactionEntity existing,
            ReactionType newType,
            Runnable onCreate,
            Runnable onDelete,
            Runnable onUpdate
    ) {

        // CREATE
        if (existing == null) {
            onCreate.run();
            return;
        }

        ReactionType oldType = existing.getType();

        // TOGGLE OFF
        if (oldType == newType) {
            onDelete.run();
            return;
        }

        // UPDATE TYPE
        onUpdate.run();
    }

    // ================= COUNT LOGIC =================
    private void increaseCount(IdeaEntity idea, ReactionType type) {

        if (type == ReactionType.LIKE) {
            idea.setLikeCount(idea.getLikeCount() + 1);
        }

        if (type == ReactionType.DISLIKE) {
            idea.setDislikeCount(idea.getDislikeCount() + 1);
        }
    }

    private void decreaseCount(IdeaEntity idea, ReactionType type) {

        if (type == ReactionType.LIKE) {
            idea.setLikeCount(Math.max(0, idea.getLikeCount() - 1));
        }

        if (type == ReactionType.DISLIKE) {
            idea.setDislikeCount(Math.max(0, idea.getDislikeCount() - 1));
        }
    }

    // ================= BUILD IDEA RESPONSE =================
    private ReactionResponse buildIdeaResponse(Long userId, Long ideaId) {

        List<Object[]> result = reactionRepository.countGroupByType(ideaId);

        Map<ReactionType, Long> counts = new HashMap<>();
        long total = 0;

        for (Object[] row : result) {
            ReactionType type = (ReactionType) row[0];
            Long count = (Long) row[1];

            counts.put(type, count);
            total += count;
        }

        ReactionEntity myReaction = reactionRepository
                .findByUserIdAndIdeaId(userId, ideaId)
                .orElse(null);

        String myType = myReaction != null
                ? myReaction.getType().name()
                : "NONE";

        return new ReactionResponse(counts, total, myType);
    }

    // ================= BUILD COMMENT RESPONSE =================
    private ReactionResponse buildCommentResponse(Long userId, Long commentId) {

        List<ReactionEntity> reactions = reactionRepository.findByCommentId(commentId);

        Map<ReactionType, Long> counts = new HashMap<>();

        for (ReactionEntity r : reactions) {
            counts.put(
                    r.getType(),
                    counts.getOrDefault(r.getType(), 0L) + 1
            );
        }

        long total = reactions.size();

        ReactionEntity myReaction = reactionRepository
                .findByCommentIdAndUserId(commentId, userId)
                .orElse(null);

        String myType = myReaction != null
                ? myReaction.getType().name()
                : "NONE";

        return new ReactionResponse(counts, total, myType);
    }

    // ================= MOCK USER =================
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