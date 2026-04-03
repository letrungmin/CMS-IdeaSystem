package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.request.DepartmentRequest;
import com.example.CRM1640.dto.response.DepartmentResponse;
import com.example.CRM1640.entities.auth.UserEntity;
import com.example.CRM1640.entities.organization.DepartmentEntity;
import com.example.CRM1640.exception.AppException;
import com.example.CRM1640.exception.ErrorCode;
import com.example.CRM1640.mappers.UserMapper;
import com.example.CRM1640.repositories.authen.DepartmentRepository;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.service.interfaces.DepartmentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // ================= CREATE =================
    @Override
    public DepartmentResponse create(DepartmentRequest request) {

        if (departmentRepository.existsByName(request.name())) {
            throw new AppException(ErrorCode.DEPARTMENT_NAME_EXIST);
        }

        UserEntity qa = validateQaManager(request.qaCoordinatorId());

        if (departmentRepository.existsByQaCoordinator_Id(qa.getId())) {
            throw new AppException(ErrorCode.USER_ALREADY_MANAGE_DEPARTMENT);
        }

        DepartmentEntity entity = new DepartmentEntity();
        entity.setName(request.name());
        entity.setQaCoordinator(qa);

        departmentRepository.save(entity);

        return mapToResponse(entity);
    }

    // ================= UPDATE =================
    @Override
    public DepartmentResponse update(Long id, DepartmentRequest request) {

        DepartmentEntity entity = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        if (!entity.getName().equals(request.name())
                && departmentRepository.existsByName(request.name())) {
            throw new AppException(ErrorCode.DEPARTMENT_NAME_EXIST);
        }

        UserEntity qa = validateQaManager(request.qaCoordinatorId());

        if (!qa.getId().equals(entity.getQaCoordinator().getId())
                && departmentRepository.existsByQaCoordinator_Id(qa.getId())) {
            throw new AppException(ErrorCode.USER_ALREADY_MANAGE_DEPARTMENT);
        }

        entity.setName(request.name());
        entity.setQaCoordinator(qa);

        departmentRepository.save(entity);

        return mapToResponse(entity);
    }

    // ================= DELETE =================
    @Override
    public void delete(Long id) {

        DepartmentEntity entity = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        if (!entity.getUsers().isEmpty()) {
            throw new AppException(ErrorCode.DEPARTMENT_HAS_USERS);
        }

        departmentRepository.delete(entity);
    }

    // ================= GET BY ID =================
    @Override
    public DepartmentResponse getById(Long id) {

        DepartmentEntity entity = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        return mapToResponse(entity);
    }

    // ================= GET ALL =================
    @Override
    public List<DepartmentResponse> getAll() {

        return departmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= VALIDATE QA =================
    private UserEntity validateQaManager(Long userId) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean isQaManager = user.getRoles()
                .stream()
                .anyMatch(r -> r.getName().equals("ROLE_QA_MANAGER"));

        if (!isQaManager) {
            throw new AppException(ErrorCode.USER_NOT_QA_MANAGER);
        }

        return user;
    }

    // ================= MAPPER =================
    private DepartmentResponse mapToResponse(DepartmentEntity entity) {

        return new DepartmentResponse(
                entity.getId(),
                entity.getName(),
                userMapper.toResponse(entity.getQaCoordinator()) // 🔥 mapping chuẩn theo bạn
        );
    }
}
