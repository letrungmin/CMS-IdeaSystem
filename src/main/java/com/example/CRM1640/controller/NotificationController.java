package com.example.CRM1640.controller;

import com.example.CRM1640.dto.ApiResponse;
import com.example.CRM1640.dto.request.EncourageRequest;
import com.example.CRM1640.service.interfaces.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/mail")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService notificationService;

    @PostMapping("/encourage")
    @PreAuthorize("hasAnyAuthority('ROLE_QA_COORDINATOR')")
    public ApiResponse<?> encourage(
            @RequestBody EncourageRequest request
    ) {

        notificationService.sendEncourageEmail(
                request.departmentId(),
                request.message()
        );

        return ApiResponse.builder()
                .result("Encourage email sent")
                .build();
    }


    @PostMapping("/encourage/my-department")
    @PreAuthorize("hasAuthority('ROLE_QA_MANAGER')")
    public ApiResponse<?> encourageMyDepartment(
            @RequestBody String message
    ) {

        notificationService.sendEncourageEmailForManager(message);

        return ApiResponse.builder()
                .result("Encourage email sent (QA Manager)")
                .build();
    }
}
