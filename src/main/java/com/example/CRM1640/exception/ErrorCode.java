package com.example.CRM1640.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // ===== SYSTEM =====
    UNCATEGORIZED(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),

    // ===== VALIDATION =====
    INVALID_INPUT(1001, "Invalid input", HttpStatus.BAD_REQUEST),

    // ===== USER =====
    USER_NOT_FOUND(2001, "User not found !!!!", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS(2002, "User already exists", HttpStatus.BAD_REQUEST),
    WRONG_PASSWORD(2002, "Wrong password", HttpStatus.BAD_REQUEST),

    USER_FIRST_NAME_INVALID(2003, "First name must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),
    USER_LAST_NAME_INVALID(2004, "Last name must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(2005, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),

    // ===== AUTH =====
    UNAUTHENTICATED(3001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(3002, "Access denied", HttpStatus.FORBIDDEN),

    // ===== TOKEN =====
    INVALID_REFRESH_TOKEN(4001, "Invalid refresh token", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_EXPIRED(4002, "Refresh token expired", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND(4003, "Refresh token not found", HttpStatus.UNAUTHORIZED),
    REFRESH_REVOKED(4004, "Refresh token has been revoked", HttpStatus.UNAUTHORIZED),

    // ===== IDEA =====
    IDEA_NOT_FOUND(5001, "Idea not found", HttpStatus.NOT_FOUND),
    IDEA_SUBMIT_EXPIRED(5002, "Idea submission has been closed", HttpStatus.UNPROCESSABLE_ENTITY),

    // ===== CATEGORY =====
    CATEGORY_NOT_FOUND(6001, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTS(6002, "Category already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_DUPLICATE(6003, "Category name already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_CREATE_FAILED(6004, "Create category failed", HttpStatus.INTERNAL_SERVER_ERROR),
    CATEGORY_UPDATE_FAILED(6005, "Update category failed", HttpStatus.INTERNAL_SERVER_ERROR),
    CATEGORY_DELETE_FAILED(6006, "Delete category failed", HttpStatus.INTERNAL_SERVER_ERROR),

    // ===== ACADEMY YEAR =====
    NON_ACTIVATE_ACADEMY_YEAR(7001,"No activated Academy year ",HttpStatus.NOT_FOUND),
    NO_TERM_FOUND(7002,"No terms found",HttpStatus.NOT_FOUND),
    ACADEMY_YEAR_NAME_EXIST(7003,"Academic year name already exists",HttpStatus.BAD_REQUEST),
    ACADEMY_YEAR_NOT_FOUND(7004,"Academic year not found",HttpStatus.BAD_REQUEST),
    ACADEMY_YEAR_MUST_BEFORE_FINAL_CLOSURE(7005,"Idea closure date must be before final closure date",HttpStatus.BAD_REQUEST),
    ACADEMY_YEAR_MUST_BE_FUTURE(7006,"Idea closure date must be in the future",HttpStatus.BAD_REQUEST),


    // ===== COMMENT =====
    COMMENT_NOT_FOUND(8001,"Comment not found",HttpStatus.NOT_FOUND),
    INVALID_COMMENT_PARENT(8002,"Invalid parent comment",HttpStatus.BAD_REQUEST),
    PARENT_COMMENT_NOT_FOUND(8003,"Parent comment not found",HttpStatus.BAD_REQUEST),
    COMMENT_EXPIRED(8004,"Comment period has ended",HttpStatus.BAD_REQUEST),


    // ===== REACTION =====
    REACTION_COMMENT_EXPIRED(10001,"Reaction Comment period has ended",HttpStatus.GONE),


    // ===== TERM =====
    MUST_ACCEPT_TERM(9001,"Must accept terms before submitting idea",HttpStatus.UNPROCESSABLE_ENTITY),
    TERM_NOT_FOUND(9002,"Terms not found",HttpStatus.NOT_FOUND),



    // ===== FILE =====
    FILE_EMPTY(9001, "File is empty", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(9002, "File exceeds maximum size", HttpStatus.BAD_REQUEST),
    FILE_INVALID_TYPE(9003, "Invalid file type", HttpStatus.BAD_REQUEST),

    FILE_SAVE_FAILED(9004, "Failed to save file", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_LOAD_FAILED(9005, "Failed to load file", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_NOT_FOUND(9006, "File not found", HttpStatus.NOT_FOUND),

    FILE_INVALID_PATH(9007, "Invalid file path", HttpStatus.BAD_REQUEST),
    FILE_DELETE_FAILED(9008, "Failed to delete files", HttpStatus.INTERNAL_SERVER_ERROR),

    STORAGE_INIT_FAILED(9009, "Cannot initialize storage", HttpStatus.INTERNAL_SERVER_ERROR),

    TOTAL_SIZE_EXCEEDED(9010, "Total upload size exceeded limit", HttpStatus.BAD_REQUEST),

    INVALID_FILE_NAME(9011, "Invalid file name", HttpStatus.BAD_REQUEST),

    FILE_ROOT_PATH_NOT_CONFIG(9012, "File root path not configured!", HttpStatus.INTERNAL_SERVER_ERROR),

    FOLDER_CREATE_FAILED(9013, "Cannot create folder", HttpStatus.INTERNAL_SERVER_ERROR),

    PATH_TRAVERSAL_ATTACK(9014, "Path traversal attack", HttpStatus.INTERNAL_SERVER_ERROR),


    // ===== Department =====
    DEPARTMENT_NAME_EXIST(10001, "Department name already exists", HttpStatus.CONFLICT ),
    USER_ALREADY_MANAGE_DEPARTMENT(10002, "User already manages another department. Choose another one", HttpStatus.CONFLICT),
    DEPARTMENT_NOT_FOUND(10003, "Department not found", HttpStatus.NOT_FOUND),
    DEPARTMENT_HAS_USERS(10004, "Department already has users assigned",HttpStatus.CONFLICT),
    USER_NOT_QA_MANAGER(10005, "Assignee must have QA Manager role", HttpStatus.FORBIDDEN),

    // ===== Term =====
    CANNOT_ACTIVE_WHEN_CREATE(10004, "Cannot activate academic year during creation. Please activate after all required terms are prepared.", HttpStatus.CONFLICT),
    TERM_NOT_READY(10005, "Terms are not ready for this academic year. Please ensure all departments have published terms before activation.", HttpStatus.CONFLICT),
    CANNOT_UPDATE_PUBLISHED_TERM(10006, "Cannot update a published term. Please create a new version instead.", HttpStatus.CONFLICT),

    // ===== AI =====
    TOXIC_CONTENT_DETECTED(11001, "Your submission has been rejected as it violates the University's ethical and content guidelines.", HttpStatus.FORBIDDEN),
    DUPLICATE_IDEA_DETECTED(11002, "Action denied. A semantically similar idea already exists in the system.", HttpStatus.CONFLICT),
    OUT_OF_DISTRIBUTION_DETECTED(11003, "Action denied. The content is entirely unrelated to university context or domains.", HttpStatus.BAD_REQUEST)
            ;



    private final int code;
    private final String message;
    private final HttpStatus status;
}
