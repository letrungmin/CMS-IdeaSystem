package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.CredentialRequest;
import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.entities.auth.RoleEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import com.example.CRM1640.mappers.UserMapper;
import com.example.CRM1640.repositories.authen.DepartmentRepository;
import com.example.CRM1640.repositories.authen.RoleRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.service.interfaces.AuthenticationService;
import com.example.CRM1640.service.interfaces.FilesStorageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {

    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    UserMapper userMapper;
    FilesStorageService filesStorageService;
    RoleRepository roleRepository;
    DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public UserResponse save(UserRequest request, MultipartFile avatar) {

        //  Validate & Fetch Department
        DepartmentEntity department = getDepartmentOrThrow(request.department());

        //  Map request -> entity
        UserEntity user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setDepartment(department);

        //  Assign roles
        user.setRoles(getRoles(request.roles()));

        //  Persist user
        UserEntity savedUser = userRepository.save(user);

        // Save avatar (if exists)
        saveAvatarIfPresent(avatar, savedUser.getUuid());
        UserResponse userResponse = userMapper.toResponse(savedUser);

        return userResponse;
    }

    public UserResponse login(CredentialRequest request) {

        UserEntity user = userRepository
                .findByEmailOrUsername(request.identifier(), request.identifier())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Compare to hashed password
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return userMapper.toResponse(user);
    }

    private DepartmentEntity getDepartmentOrThrow(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Department not found with id: " + departmentId));
    }

    private Set<RoleEntity> getRoles(Set<Long> roleIds) {
        return new HashSet<>(roleRepository.findAllById(roleIds));
    }

    private void saveAvatarIfPresent(MultipartFile avatar, UUID userUuid) {
        if (avatar != null && !avatar.isEmpty()) {
            filesStorageService.save(avatar, userUuid);
        }
    }
}
