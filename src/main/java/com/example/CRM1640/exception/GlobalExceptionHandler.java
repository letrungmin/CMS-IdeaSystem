package com.example.CRM1640.exception;

import com.example.CRM1640.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ===== CUSTOM =====
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<?>> handleAppException(
            AppException ex,
            HttpServletRequest request
    ) {
        ErrorCode error = ex.getErrorCode();

        return ResponseEntity.status(error.getStatus())
                .body(ApiResponse.builder()
                        .code(error.getCode())
                        .message(error.getMessage())
                        .path(request.getRequestURI())
                        .timestamp(System.currentTimeMillis())
                        .build());
    }

    // ===== VALIDATION =====
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {

        String key = ex.getFieldError().getDefaultMessage();

        ErrorCode errorCode;

        try {
            errorCode = ErrorCode.valueOf(key);
        } catch (Exception e) {
            errorCode = ErrorCode.INVALID_INPUT;
        }

        return ResponseEntity.status(errorCode.getStatus())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .path(request.getRequestURI())
                        .timestamp(System.currentTimeMillis())
                        .build());
    }

    // ===== FORBIDDEN =====
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> handleAccessDenied(HttpServletRequest request) {

        ErrorCode error = ErrorCode.FORBIDDEN;

        return ResponseEntity.status(error.getStatus())
                .body(ApiResponse.builder()
                        .code(error.getCode())
                        .message(error.getMessage())
                        .path(request.getRequestURI())
                        .timestamp(System.currentTimeMillis())
                        .build());
    }

    // ===== UNKNOWN =====
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleUnknown(
            Exception ex,
            HttpServletRequest request
    ) {

        ErrorCode error = ErrorCode.UNCATEGORIZED;

        return ResponseEntity.status(error.getStatus())
                .body(ApiResponse.builder()
                        .code(error.getCode())
                        .message(ex.getMessage())
                        .path(request.getRequestURI())
                        .timestamp(System.currentTimeMillis())
                        .build());
    }
}
