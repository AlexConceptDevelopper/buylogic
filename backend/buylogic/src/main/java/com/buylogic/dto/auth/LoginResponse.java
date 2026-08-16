package com.buylogic.dto.auth;

public record LoginResponse(
        String token,
        Integer userId,
        Integer companyId,
        String email,
        String role) {
}