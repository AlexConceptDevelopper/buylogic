package com.buylogic.dto.auth;

public record RegisterResponse(
    Integer userId,
    Integer companyId,
    String email,
    String role,
    String message
) {
}