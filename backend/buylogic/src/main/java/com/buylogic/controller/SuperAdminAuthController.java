package com.buylogic.controller;

import com.buylogic.dto.superadmin.SuperAdminLoginDTO;
import com.buylogic.service.SuperAdminAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/super-admin")
public class SuperAdminAuthController {

    private final SuperAdminAuthService superAdminAuthService;

    public SuperAdminAuthController(SuperAdminAuthService superAdminAuthService) {
        this.superAdminAuthService = superAdminAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @Valid @RequestBody SuperAdminLoginDTO request) {

        String token = superAdminAuthService.authenticate(request);

        return ResponseEntity.ok(Map.of("token", token));
    }
}