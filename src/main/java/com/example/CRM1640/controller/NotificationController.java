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

    // ====================================================================================
    // [Min code] - BẮT ĐẦU PHẦN THÊM MỚI CHO TÍNH NĂNG "NÚT CHUÔNG" (IN-APP NOTIFICATION)
    // Code cũ ở trên của Thanh được giữ nguyên 100%, tuyệt đối không đụng chạm.
    // ====================================================================================

    @GetMapping("/in-app/me")
    public ApiResponse<?> getMyInAppNotifications() {
        return ApiResponse.builder()
                .result(notificationService.getMyInAppNotifications())
                .message("Lấy danh sách chuông thông báo thành công")
                .build();
    }

    @PutMapping("/in-app/{id}/read")
    public ApiResponse<?> markInAppAsRead(@PathVariable Long id) {
        notificationService.markInAppAsRead(id);
        return ApiResponse.builder()
                .result("Success")
                .message("Đã tắt chấm đỏ thông báo")
                .build();
    }

    // ====================================================================================
    // [Min code] - KẾT THÚC PHẦN THÊM MỚI CHO "NÚT CHUÔNG"
    // ====================================================================================
}