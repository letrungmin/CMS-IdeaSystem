package com.example.CRM1640.service.implementation;

import com.example.CRM1640.config.CustomUserPrincipal;
import com.example.CRM1640.config.JwtService;
import com.example.CRM1640.dto.request.LoginRequest;
import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.AuthResponse;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.entities.auth.RefreshTokenEntity;
import com.example.CRM1640.entities.auth.RoleEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import com.example.CRM1640.exception.AppException;
import com.example.CRM1640.exception.ErrorCode;
import com.example.CRM1640.mappers.UserMapper;
import com.example.CRM1640.repositories.authen.DepartmentRepository;
import com.example.CRM1640.repositories.authen.RefreshTokenRepository;
import com.example.CRM1640.repositories.authen.RoleRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.service.interfaces.AuthenticationService;
import com.example.CRM1640.service.interfaces.FilesStorageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
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
    RefreshTokenRepository refreshTokenRepository;
    JwtService jwtService;

    // ================= REGISTER =================
    @Override
    @Transactional
    public UserResponse save(UserRequest request, MultipartFile avatar) {

        DepartmentEntity department = getDepartmentOrThrow(request.department());

        UserEntity user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setDepartment(department);

        user.setRoles(getRoles(request.roles()));

        UserEntity savedUser = userRepository.save(user);

        String avatarUrl = saveAvatarIfPresent(avatar, savedUser.getUuid().toString());
        if (avatarUrl != null) {
            savedUser.setAvatarUrl(avatarUrl);
        }

        return userMapper.toResponse(savedUser);
    }

    // ================= LOGIN =================
    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {

        UserEntity user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        RefreshTokenEntity refreshToken = createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken.getToken());
    }

    // ================= REFRESH =================
    @Override
    @Transactional
    public AuthResponse refresh(String refreshToken) {

        RefreshTokenEntity oldToken = getValidRefreshToken(refreshToken);

        UserEntity user = oldToken.getUser();

        // revoke old token (ROTATE)
        oldToken.setRevoked(true);

        // generate new access token
        String newAccessToken = jwtService.generateAccessToken(user);

        // create new refresh token
        RefreshTokenEntity newRefreshToken = createRefreshToken(user);

        return new AuthResponse(newAccessToken, newRefreshToken.getToken());
    }

    // ================= LOGOUT =================
    @Override
    @Transactional
    public void logout(String refreshToken) {

        RefreshTokenEntity token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        token.setRevoked(true);
    }

    @Override
    @Transactional
    public UserResponse introspect() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String username;

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserPrincipal customUser) {
            username = customUser.getUsername();
        } else {
            username = principal.toString();
        }


        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));


        return userMapper.toResponse(user);
    }

    // ================= HELPER =================

    private DepartmentEntity getDepartmentOrThrow(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Department not found with id: " + departmentId));
    }

    private Set<RoleEntity> getRoles(Set<Long> roleIds) {
        return new HashSet<>(roleRepository.findAllById(roleIds));
    }

    private String saveAvatarIfPresent(MultipartFile avatar, String userUuid) {
        if (avatar != null && !avatar.isEmpty()) {
            return filesStorageService.saveAvatar(avatar, userUuid);
        }
        return null;
    }

    // ================= REFRESH TOKEN =================

    private RefreshTokenEntity createRefreshToken(UserEntity user) {

        RefreshTokenEntity token = new RefreshTokenEntity();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString()); // UUID (secure enough)
        token.setExpiryDate(LocalDateTime.now().plusDays(7));
        token.setRevoked(false);

        return refreshTokenRepository.save(token);
    }

    private RefreshTokenEntity getValidRefreshToken(String refreshToken) {

        RefreshTokenEntity token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REFRESH_TOKEN));

        if (token.isRevoked()) {
            throw new AppException(ErrorCode.REFRESH_REVOKED);
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        return token;
    }
}