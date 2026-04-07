package com.example.CRM1640.repositories.authen;

import com.example.CRM1640.entities.auth.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmailOrUsername(String email, String username);

    Optional<UserEntity> findByUsername(String username);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.active = true")
    Long countActiveUsers();


}
