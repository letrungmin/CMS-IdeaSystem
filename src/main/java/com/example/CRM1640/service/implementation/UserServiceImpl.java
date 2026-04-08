package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.response.UserResponseAdminRole;
import com.example.CRM1640.dto.response.UserResponseQAManagerRole;
import com.example.CRM1640.entities.auth.RoleEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.idea.IdeaRepository;
import com.example.CRM1640.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final IdeaRepository ideaRepository;

    @Override
    public Page<UserResponseAdminRole> getAllUsers(int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return userRepository.findAll(pageable)
                .map(this::mapToAdminResponse);
    }

    @Override
    public Page<UserResponseQAManagerRole> getAllUsersForQAManager(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return userRepository.findAll(pageable)
                .map(this::mapToQAManagerResponse);
    }

    @Override
    public Page<UserResponseAdminRole> getAllQAManagerWithoutDepartment(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return userRepository.findQAManagerWithoutDepartment(pageable)
                .map(this::mapToAdminResponse);
    }

    private UserResponseQAManagerRole mapToQAManagerResponse(UserEntity user) {

        List<String> roles = user.getRoles()
                .stream()
                .map(r -> r.getName().replace("ROLE_", ""))
                .toList();

        String departmentName = user.getDepartment() != null
                ? user.getDepartment().getName()
                : null;

        Long approvedCount = ideaRepository.countApprovedIdeasByUserId(user.getId());

        return new UserResponseQAManagerRole(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                departmentName,
                roles,
                approvedCount
        );
    }


    private UserResponseAdminRole mapToAdminResponse(UserEntity user) {

        List<String> roles = user.getRoles()
                .stream()
                .map(RoleEntity::getName)
                .toList();

        String departmentName = user.getDepartment() != null
                ? user.getDepartment().getName()
                : null;

        return new UserResponseAdminRole(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                departmentName,
                roles
        );
    }
}
