package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.CreateCommentRequest;
import com.example.CRM1640.dto.response.CommentResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CommentService {
    CommentResponse create(CreateCommentRequest request);

    Page<CommentResponse> getRootComments(Long ideaId, int page, int size, String sort);

    List<CommentResponse> getReplies(Long commentId);
}
