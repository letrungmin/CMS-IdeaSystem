package com.example.CRM1640.service.implementation;

import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import com.example.CRM1640.entities.other.EncourageEvent;
import com.example.CRM1640.exception.AppException;
import com.example.CRM1640.exception.ErrorCode;
import com.example.CRM1640.repositories.authen.DepartmentRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.service.interfaces.NotificationService;
import com.example.CRM1640.service.interfaces.RabbitMQProducer;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

// =======================================================
// [Min code] IMPORT FOR IN-APP NOTIFICATION FEATURE
// =======================================================
import com.example.CRM1640.dto.response.NotificationResponse;
import com.example.CRM1640.repositories.system.NotificationRepository;
import com.example.CRM1640.entities.system.NotificationEntity;
import com.example.CRM1640.entities.idea.IdeaEntity;
import com.example.CRM1640.enums.NotificationType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final RabbitMQProducer rabbitMQProducer;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    // [Min code] Inject Notification Repository
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void sendEncourageEmail(Long departmentId, String message) {

        // ================= CURRENT USER =================
        UserEntity currentUser = getCurrentUser();

        // ================= CHECK ROLE =================
        boolean isQACoordinator = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_QA_COORDINATOR"));

        if (!isQACoordinator) {
            throw new RuntimeException("Only QA Coordinator can send encourage email");
        }

        // ================= FIND DEPARTMENT =================
        DepartmentEntity department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // ================= GET STAFF =================
        List<UserEntity> users = userRepository.findStaffByDepartment(departmentId);

        List<String> staffEmails = users.stream()
                .map(UserEntity::getEmail)
                .toList();

        if (staffEmails.isEmpty()) {
            throw new RuntimeException("No staff found in department");
        }

        // ================= SEND EVENT =================
        rabbitMQProducer.sendEncourage(
                EncourageEvent.builder()
                        .departmentId(department.getId())
                        .departmentName(department.getName())
                        .emails(staffEmails)
                        .message(message)
                        .senderName(currentUser.getUsername())
                        .build()
        );
    }

    @Override
    @Transactional
    public void sendEncourageEmailForManager(String message) {

        // ================= CURRENT USER =================
        UserEntity currentUser = getCurrentUser();

        // ================= CHECK ROLE =================
        boolean isManager = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_QA_MANAGER"));

        if (!isManager) {
            throw new RuntimeException("Only QA Manager can use this function");
        }

        // ================= GET DEPARTMENT =================
        DepartmentEntity department = currentUser.getDepartment();

        if (department == null) {
            throw new RuntimeException("User does not belong to any department");
        }

        // ================= GET STAFF =================
        List<UserEntity> users = userRepository.findStaffByDepartment(department.getId());

        List<String> staffEmails = users.stream()
                .map(UserEntity::getEmail)
                .toList();

        if (staffEmails.isEmpty()) {
            throw new RuntimeException("No staff found in department");
        }

        // ================= SEND EVENT =================
        rabbitMQProducer.sendEncourage(
                EncourageEvent.builder()
                        .departmentId(department.getId())
                        .departmentName(department.getName())
                        .emails(staffEmails)
                        .message(message)
                        .senderName(currentUser.getUsername())
                        .build()
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


    // ====================================================================================
    // [Min code] - START OF IN-APP NOTIFICATION IMPLEMENTATION
    // ====================================================================================

    @Override
    public List<NotificationResponse> getMyInAppNotifications() {
        UserEntity currentUser = getCurrentUser();
        List<NotificationEntity> entities = notificationRepository.findTop20ByReceiverIdOrderByCreatedAtDesc(currentUser.getId());

        // Map Entity to DTO to prevent Jackson Infinite Recursion
        return entities.stream().map(notif -> {
            NotificationResponse.IdeaInfo ideaInfo = null;
            if (notif.getIdea() != null) {
                ideaInfo = new NotificationResponse.IdeaInfo(notif.getIdea().getId());
            }

            return NotificationResponse.builder()
                    .id(notif.getId())
                    .title(notif.getTitle())
                    .message(notif.getMessage())
                    .type(notif.getType().name())
                    .read(notif.isRead())
                    .createdAt(notif.getCreatedAt())
                    .idea(ideaInfo)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markInAppAsRead(Long notificationId) {
        UserEntity currentUser = getCurrentUser();

        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // [FIXED] Use getReceiver().getId() instead of getReceiverId()
        if (!notification.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access Denied: You do not own this notification");
        }

        // [FIXED] Use isRead() and setRead() following Lombok boolean naming convention
        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    @Override
    @Transactional
    public void createNotification(Long receiverId, Long actorId, Long ideaId, String title, String message, String type) {
        NotificationEntity notification = new NotificationEntity();

        // [FIXED] Use Entity Proxy to set foreign key without querying the DB
        UserEntity receiver = new UserEntity();
        receiver.setId(receiverId);
        notification.setReceiver(receiver);

        if (actorId != null) {
            UserEntity actor = new UserEntity();
            actor.setId(actorId);
            notification.setActor(actor);
        }

        if (ideaId != null) {
            IdeaEntity idea = new IdeaEntity();
            idea.setId(ideaId);
            notification.setIdea(idea);
        }

        notification.setTitle(title);
        notification.setMessage(message);

        // [FIXED] Parse String to Enum NotificationType
        notification.setType(NotificationType.valueOf(type));

        // [FIXED] Initialize as unread
        notification.setRead(false);

        // No need to set UUID or CreatedAt as @PrePersist handles it automatically
        notificationRepository.save(notification);
    }

    // ====================================================================================
    // [Min code] - END OF IN-APP NOTIFICATION IMPLEMENTATION
    // ====================================================================================
}