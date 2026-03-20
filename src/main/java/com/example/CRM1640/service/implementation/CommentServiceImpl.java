package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.CreateCommentRequest;
import com.example.CRM1640.dto.response.CommentResponse;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.idea.CommentEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.idea.CommentRepository;
import com.example.CRM1640.repositories.idea.IdeaRepository;
import com.example.CRM1640.service.interfaces.CommentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;

    // ================= CREATE =================
    @Override
    @Transactional
    public CommentResponse create(CreateCommentRequest request) {

        UserEntity user = getCurrentUser();

        IdeaEntity idea = ideaRepository.findById(request.ideaId())
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        CommentEntity parent = null;

        // handle reply
        if (request.parentId() != null) {

            parent = commentRepository.findById(request.parentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));

            // IMPORTANT: ensure same idea
            if (!parent.getIdea().getId().equals(idea.getId())) {
                throw new RuntimeException("Invalid parent comment");
            }
        }

        CommentEntity comment = new CommentEntity();
        comment.setContent(request.content());
        comment.setAnonymous(request.anonymous());
        comment.setAuthor(user);
        comment.setIdea(idea);
        comment.setParent(parent);

        commentRepository.save(comment);

        // ================= UPDATE COUNT =================
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

        String authorName = c.isAnonymous()
                ? "Anonymous"
                : c.getAuthor().getFirstName() + " " + c.getAuthor().getLastName();

        return new CommentResponse(
                c.getId(),
                c.getContent(),
                authorName,
                c.isAnonymous(),
                c.getCreatedAt(),
                c.getReplyCount(),
                c.getLikeCount(),
                replies
        );
    }

    private UserEntity getCurrentUser() {
        return userRepository.findByUsername("testuser")
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
