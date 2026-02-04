package com.example.CRM1640.controller;

import com.example.CRM1640.dto.request.UserRequest;
import com.example.CRM1640.dto.response.UserResponse;
import com.example.CRM1640.service.interfaces.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> registerUser(
            @RequestPart("data") @Valid UserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        UserResponse userResponse = authenticationService.save(request,avatar);
        return ResponseEntity.ok("User created");
    }
}

