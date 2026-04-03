package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.response.RoleResponseOff;
import com.example.CRM1640.entities.auth.RoleEntity;
import com.example.CRM1640.repositories.authen.RoleRepository;
import com.example.CRM1640.service.interfaces.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<RoleResponseOff> getAll() {

        return roleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= MAPPER =================
    private RoleResponseOff mapToResponse(RoleEntity role) {
        return new RoleResponseOff(
                role.getId(),
                role.getName(),
                role.getDescription()
        );
    }
}
