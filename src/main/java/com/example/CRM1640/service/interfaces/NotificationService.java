package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.response.NotificationResponse;
import org.apache.xmlbeans.impl.xb.xmlconfig.Extensionconfig;
import java.util.List;
import com.example.CRM1640.entities.system.NotificationEntity;

public interface NotificationService {

    void sendEncourageEmail(Long departmentId, String message);

    void sendEncourageEmailForManager(String message);

    // ====================================================================================
    // [Min code] - IN-APP NOTIFICATION
    // ====================================================================================

    List<NotificationResponse> getMyInAppNotifications();

    void markInAppAsRead(Long notificationId);

    // 👉 THÊM ĐÚNG DÒNG NÀY VÀO LÀ HẾT LỖI 88 NGAY LẬP TỨC:
    void createNotification(Long receiverId, Long actorId, Long ideaId, String title, String message, String type);

}