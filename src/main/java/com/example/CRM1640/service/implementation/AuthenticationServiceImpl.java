package com.example.CRM1640.service.implementation;

import com.example.CRM1640.config.JwtService;
import com.example.CRM1640.dto.request.LoginRequest;
import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.AuthResponse;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.entities.auth.RefreshTokenEntity;
import com.example.CRM1640.entities.auth.RoleEntity;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import com.example.CRM1640.mappers.UserMapper;
import com.example.CRM1640.repositories.authen.DepartmentRepository;
import com.example.CRM1640.repositories.authen.RefreshTokenRepository;
import com.example.CRM1640.repositories.authen.RoleRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.service.interfaces.AuthenticationService;
import com.example.CRM1640.service.interfaces.FilesStorageService;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

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
        saveAvatarIfPresent(avatar, savedUser.getUuid()+"");

        // 👉 SAVE AVATAR
        String avatarUrl = saveAvatarIfPresent(avatar, user.getUuid()+"");

        if (avatarUrl != null) {
            user.setAvatarUrl(avatarUrl);
        }

        UserResponse userResponse = userMapper.toResponse(savedUser);

        return userResponse;
    }

//    public UserResponse login(LoginRequest request) {
//
//        UserEntity user = userRepository
//                .findByEmailOrUsername(request.username(), request.password())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Compare to hashed password
//        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        return userMapper.toResponse(user);
//    }

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
          return  filesStorageService.saveAvatar(avatar, userUuid);
        }
        return null;
    }


    public AuthResponse login(LoginRequest request) {

        UserEntity user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }


        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        System.out.println("Helloooooooo "+Base64.getEncoder().encodeToString(key.getEncoded()));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveRefreshToken(user, refreshToken);

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse refresh(String refreshToken) {

        RefreshTokenEntity token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (token.isRevoked() || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        UserEntity user = token.getUser();

        String newAccess = jwtService.generateAccessToken(user);

        return new AuthResponse(newAccess, refreshToken);
    }

    public void logout(String refreshToken) {

        RefreshTokenEntity token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow();

        token.setRevoked(true);
    }

    private void saveRefreshToken(UserEntity user, String token) {

        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setToken(token);
        entity.setUser(user);
        entity.setExpiryDate(LocalDateTime.now().plusDays(7));

        refreshTokenRepository.save(entity);
    }
}
