package com.example.CRM1640.service.interfaces;

import com.example.CRM1640.dto.response.UserResponseAdminRole;
import com.example.CRM1640.dto.response.UserResponseQAManagerRole;
import org.springframework.data.domain.Page;

public interface UserService {
    Page<UserResponseAdminRole> getAllUsers(int page, int size);

    Page<UserResponseQAManagerRole> getAllUsersForQAManager(int page, int size);
}
