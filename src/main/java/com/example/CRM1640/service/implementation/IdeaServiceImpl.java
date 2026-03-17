package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.CreateIdeaRequest;
import com.example.CRM1640.dto.response.IdeaResponse;
import com.example.CRM1640.entities.auth.TermsEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.idea.CategoryEntity;
import com.example.CRM1640.entities.idea.IdeaCategoryEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.repositories.authen.TermsRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.authen.UserTermsAcceptanceRepository;
import com.example.CRM1640.repositories.idea.CategoryRepository;
import com.example.CRM1640.repositories.idea.IdeaCategoryRepository;
import com.example.CRM1640.repositories.idea.IdeaRepository;
import com.example.CRM1640.repositories.organization.AcademicYearRepository;
import com.example.CRM1640.service.interfaces.IdeaService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Override
    @Transactional
    public IdeaResponse submitIdea(CreateIdeaRequest request) {

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

        String username = "tes6tuser2"; // TODO: replace SecurityContext

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
