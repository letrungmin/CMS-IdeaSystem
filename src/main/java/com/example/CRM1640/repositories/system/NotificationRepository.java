package com.example.CRM1640.repositories.system;

import com.example.CRM1640.entities.system.NotificationEntity; // Nhớ check xem Thanh đặt tên Entity là gì nhé
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    // Câu thần chú của Spring Data JPA: Tự động dịch tên hàm thành câu query SQL
    // Lấy top 20 thông báo của user đó và sắp xếp mới nhất lên đầu
    List<NotificationEntity> findTop20ByReceiverIdOrderByCreatedAtDesc(Long receiverId);
}