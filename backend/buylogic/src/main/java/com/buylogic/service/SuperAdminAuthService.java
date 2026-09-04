package com.buylogic.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.superadmin.SuperAdminLoginDTO;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.model.SuperAdmin;
import com.buylogic.repository.global.SuperAdminRepository;
import com.buylogic.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SuperAdminAuthService {

    private final SuperAdminRepository superAdminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String authenticate(SuperAdminLoginDTO loginDTO) {
        String email = loginDTO.getEmail().trim().toLowerCase();

        SuperAdmin admin = superAdminRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials."));

        if (!admin.getActive()) {
            throw new IllegalStateException("Super admin account is disabled.");
        }

        if (!passwordEncoder.matches(loginDTO.getPassword(), admin.getPasswordHash())) {
            throw new ResourceNotFoundException("Invalid credentials.");
        }

        // Génération d'un token global avec le rôle SUPER_OWNER (sans companyId)
        return jwtUtil.generateSuperAdminToken(
                admin.getIdSuperAdmin(),
                admin.getEmail(),
                "SUPER_OWNER"
        );
    }
}