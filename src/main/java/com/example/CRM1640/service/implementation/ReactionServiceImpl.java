package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.ReactionRequest;
import com.example.CRM1640.dto.response.ReactionResponse;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.entities.idea.ReactionEntity;
import com.example.CRM1640.enums.ReactionType;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.idea.IdeaRepository;
import com.example.CRM1640.repositories.idea.ReactionRepository;
import com.example.CRM1640.service.interfaces.ReactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReactionServiceImpl implements ReactionService {

    private final ReactionRepository reactionRepository;
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReactionResponse react(ReactionRequest request) {

        UserEntity user = getCurrentUser();

        // Get idea
        IdeaEntity idea = ideaRepository.findById(request.getIdeaId())
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        ReactionType newType = request.getType();

        // Find existing reaction
        ReactionEntity existing = reactionRepository
                .findByUserIdAndIdeaId(user.getId(), idea.getId())
                .orElse(null);

        // ================= CASE 1: CREATE =================
        if (existing == null) {

            ReactionEntity reaction = new ReactionEntity();
            reaction.setUser(user);
            reaction.setIdea(idea);
            reaction.setType(newType);

            reactionRepository.save(reaction);

            // Update count for LIKE / DISLIKE only
            increaseCount(idea, newType);
        }

        // ================= CASE 2: UPDATE / DELETE =================
        else {

            ReactionType oldType = existing.getType();

            // SAME → remove (toggle off)
            if (oldType == newType) {

                reactionRepository.delete(existing);
                decreaseCount(idea, oldType);
            }

            // CHANGE TYPE
            else {

                existing.setType(newType);
                reactionRepository.save(existing);

                decreaseCount(idea, oldType);
                increaseCount(idea, newType);
            }
        }

        return buildResponse(user.getId(), idea.getId());
    }

    // ================= COUNT LOGIC =================

    // Increase count for LIKE / DISLIKE only
    private void increaseCount(IdeaEntity idea, ReactionType type) {

        if (type == ReactionType.LIKE) {
            idea.setLikeCount(idea.getLikeCount() + 1);
        }

        if (type == ReactionType.DISLIKE) {
            idea.setDislikeCount(idea.getDislikeCount() + 1);
        }
    }

    // Decrease count safely (avoid negative)
    private void decreaseCount(IdeaEntity idea, ReactionType type) {

        if (type == ReactionType.LIKE) {
            idea.setLikeCount(Math.max(0, idea.getLikeCount() - 1));
        }

        if (type == ReactionType.DISLIKE) {
            idea.setDislikeCount(Math.max(0, idea.getDislikeCount() - 1));
        }
    }

    // ================= BUILD RESPONSE =================

    private ReactionResponse buildResponse(Long userId, Long ideaId) {

        // Get grouped counts
        List<Object[]> result = reactionRepository.countGroupByType(ideaId);

        Map<ReactionType, Long> counts = new HashMap<>();
        long total = 0;

        for (Object[] row : result) {

            ReactionType type = (ReactionType) row[0];
            Long count = (Long) row[1];

            counts.put(type, count);
            total += count;
        }

        // Get current user's reaction
        ReactionEntity myReaction = reactionRepository
                .findByUserIdAndIdeaId(userId, ideaId)
                .orElse(null);

        String myType = myReaction != null
                ? myReaction.getType().name()
                : "NONE";

        return new ReactionResponse(counts, total, myType);
    }

    // ================= MOCK CURRENT USER =================
    private UserEntity getCurrentUser() {

        String username = "testuser"; // TODO: replace with SecurityContext

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
