package com.example.CRM1640.controller;

import com.example.CRM1640.dto.request.CreateCommentRequest;
import com.example.CRM1640.dto.response.CommentResponse;
import com.example.CRM1640.service.interfaces.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // CREATE
    @PostMapping
    public CommentResponse create(@RequestBody CreateCommentRequest request) {
        return commentService.create(request);
    }

    // ROOT COMMENTS
    @GetMapping("/idea/{ideaId}")
    public Page<CommentResponse> getRootComments(
            @PathVariable Long ideaId,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "newest") String sort
    ) {
        return commentService.getRootComments(ideaId, page, size, sort);
    }

    // REPLIES
    @GetMapping("/{commentId}/replies")
    public List<CommentResponse> getReplies(@PathVariable Long commentId) {
        return commentService.getReplies(commentId);
    }
}
