package com.example.CRM1640.controller;

import com.example.CRM1640.dto.request.ReactCommentRequest;
import com.example.CRM1640.dto.request.ReactionRequest;
import com.example.CRM1640.dto.response.ReactionResponse;
import com.example.CRM1640.service.interfaces.ReactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reactions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReactionController {

    ReactionService reactionService;

    @PostMapping("/idea")
    public ResponseEntity<ReactionResponse> react(@RequestBody ReactionRequest request) {
        return ResponseEntity.ok(reactionService.react(request));
    }

    @PostMapping("/comment")
    public ReactionResponse reactComment(@RequestBody ReactCommentRequest request) {
        return reactionService.reactComment(request);
    }
}
