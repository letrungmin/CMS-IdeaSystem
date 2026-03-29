package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.request.LoginRequest;
import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.AuthResponse;
import com.example.CRM1640.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;

public interface AuthenticationService {
    UserResponse save(UserRequest userRequest, MultipartFile avatar);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);

    UserResponse introspect();
}
