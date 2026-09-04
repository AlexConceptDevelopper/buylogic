package com.buylogic.controller;

import com.buylogic.dto.auth.LoginRequest;
import com.buylogic.dto.auth.LoginResponse;
import com.buylogic.dto.auth.RegisterRequest;
import com.buylogic.dto.auth.RegisterResponse;
import com.buylogic.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse response = authService.register(request);

        return ResponseEntity.ok(response); // Passe en 200 OK
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.processForgotPassword(email);
        // On renvoie toujours un OK pour ne pas révéler si l'email existe ou non en
        // base
        return ResponseEntity.ok(Map.of("message", "Si cet e-mail existe, un lien de réinitialisation a été envoyé."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        boolean success = authService.resetPassword(token, newPassword);

        if (!success) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le lien de réinitialisation est invalide ou a expiré."));
        }

        return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour avec succès."));
    }
}