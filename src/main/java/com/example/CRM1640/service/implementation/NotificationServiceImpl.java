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

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final RabbitMQProducer rabbitMQProducer;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;


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
}
