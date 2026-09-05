package com.buylogic.exception;

import com.buylogic.model.AuditLog;
import com.buylogic.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final AdminService adminService;

    public GlobalExceptionHandler(AdminService adminService) {
        this.adminService = adminService;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(
            ResourceNotFoundException exception) {

        ApiError error = new ApiError(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> handleConflict(
            ConflictException exception) {

        ApiError error = new ApiError(
            LocalDateTime.now(),
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException exception) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error ->
                    error.getField() + " : " + error.getDefaultMessage()
                )
                .orElse("Invalid request.");

        ApiError error = new ApiError(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            message
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(
            Exception exception, HttpServletRequest request) {

        // 📝 Enregistrement automatique du crash dans les logs d'audit
        try {
            String details = exception.getMessage() != null ? exception.getMessage() : "Erreur interne inconnue";
            if (details.length() > 255) {
                details = details.substring(0, 252) + "...";
            }

            String ipAddress = request.getRemoteAddr();

            adminService.createAuditLog(
                "SYSTEM_CRASH_EXCEPTION",
                "System / Uncaught",
                ipAddress != null ? ipAddress : "Internal",
                AuditLog.AuditStatus.CRITICAL,
                "Route: " + request.getRequestURI() + " | Erreur: " + details
            );
        } catch (Exception logEx) {
            System.err.println("Impossible d'enregistrer le log de crash : " + logEx.getMessage());
        }

        ApiError error = new ApiError(
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            "An unexpected error occurred."
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }
}