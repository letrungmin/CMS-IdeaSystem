package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.entities.UserEntity;
import com.example.CRM1640.mappers.UserMapper;
import com.example.CRM1640.repositories.UserRepository;
import com.example.CRM1640.service.interfaces.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {

    UserRepository userRepository;
    UserMapper userMapper;

    @Override
    public UserResponse save(UserRequest userRequest, MultipartFile avatar) {
        UserEntity userEntity = userMapper.toEntity(userRequest);
        return userMapper.toResponse(userRepository.save(userEntity));
    }
}
