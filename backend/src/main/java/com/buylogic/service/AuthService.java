package com.buylogic.service;

import com.buylogic.dto.auth.LoginRequest;
import com.buylogic.dto.auth.LoginResponse;
import com.buylogic.dto.auth.RegisterRequest;
import com.buylogic.dto.auth.RegisterResponse;
import com.buylogic.model.AppUser;
import com.buylogic.model.Company;
import com.buylogic.model.CompanyConfiguration;
import com.buylogic.model.Subscription;
import com.buylogic.model.enums.Role;
import com.buylogic.repository.global.AppUserRepository;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.SubscriptionRepository;
import com.buylogic.security.JwtUtil;

import jakarta.transaction.Transactional;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final CompanyRepository companyRepository;
    private final AppUserRepository appUserRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(
            CompanyRepository companyRepository,
            AppUserRepository appUserRepository,
            SubscriptionRepository subscriptionRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            @Lazy EmailService emailService) {
        this.companyRepository = companyRepository;
        this.appUserRepository = appUserRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (appUserRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("A user with this email already exists.");
        }

        Company company = new Company();
        company.setName(request.companyName().trim());
        company.setEmail(email);
        company.setActive(false); // La company est inactive tant que l'e-mail n'est pas vérifié

        CompanyConfiguration configuration = new CompanyConfiguration();
        configuration.setCompany(company);
        configuration.setProductManagementMode(request.productManagementMode());
        company.setConfiguration(configuration);

        Company savedCompany = companyRepository.save(company);

        Subscription subscription = new Subscription();
        subscription.setCompany(savedCompany);
        subscription.setStatus("TRIAL");
        subscriptionRepository.save(subscription);

        // Génération du token de vérification d'e-mail (valable 24h)
        String verificationToken = UUID.randomUUID().toString();

        AppUser user = new AppUser();
        user.setCompany(savedCompany);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setRole(Role.OWNER);
        user.setActive(false); // Le compte est inactif tant que l'e-mail n'est pas vérifié
        user.setResetToken(verificationToken); // On réutilise le champ token
        user.setResetTokenExpiresAt(LocalDateTime.now().plusHours(24)); // Expiration 24h

        AppUser savedUser = appUserRepository.save(user);

        // Envoi de l'e-mail d'activation
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);

        return new RegisterResponse(
                savedUser.getIdUser(),
                savedCompany.getIdCompany(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                "Account created successfully. Please check your email to activate your account.");
    }

    @Transactional
    public boolean verifyAccount(String token) {
        if (token == null) {
            return false;
        }

        AppUser user = appUserRepository.findByResetToken(token).orElse(null);
        if (user == null || user.getResetTokenExpiresAt() == null
                || user.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        // 1. Activer le compte utilisateur
        user.setActive(true);
        user.setResetToken(null);
        user.setResetTokenExpiresAt(null);
        appUserRepository.save(user);

        // 2. Activer la company associée
        Company company = user.getCompany();
        if (company != null) {
            company.setActive(true);
            companyRepository.save(company);
        }

        return true;
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        Company company = user.getCompany();

        String token = jwtUtil.generateToken(
                user.getIdUser(),
                user.getEmail(),
                user.getRole().name(),
                company.getIdCompany());

        return new LoginResponse(
                token,
                user.getIdUser(),
                company.getIdCompany(),
                user.getEmail(),
                user.getRole().name());
    }

    @Transactional
    public void processForgotPassword(String email) {
        if (email == null) {
            return;
        }
        String normalizedEmail = email.trim().toLowerCase();
        appUserRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiresAt(LocalDateTime.now().plusMinutes(15));
            appUserRepository.save(user);

            emailService.sendPasswordResetEmail(user.getEmail(), token);
        });
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        if (token == null || newPassword == null) {
            return false;
        }

        AppUser user = appUserRepository.findByResetToken(token).orElse(null);

        if (user == null || user.getResetTokenExpiresAt() == null
                || user.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiresAt(null);
        appUserRepository.save(user);

        return true;
    }
}