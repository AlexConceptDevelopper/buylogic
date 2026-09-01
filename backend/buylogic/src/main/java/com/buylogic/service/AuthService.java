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

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final CompanyRepository companyRepository;
        private final AppUserRepository appUserRepository;
        private final SubscriptionRepository subscriptionRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;

        @Transactional
        public RegisterResponse register(
                        RegisterRequest request) {

                String email = request.email()
                            .trim()
                            .toLowerCase();

                if (appUserRepository.existsByEmail(email)) {
                        throw new IllegalArgumentException(
                                    "A user with this email already exists.");
                }

                Company company = new Company();

                company.setName(
                            request.companyName().trim());

                company.setEmail(email);

                company.setActive(true);

                CompanyConfiguration configuration = new CompanyConfiguration();

                configuration.setCompany(company);

                configuration.setProductManagementMode(
                            request.productManagementMode());

                company.setConfiguration(configuration);

                Company savedCompany = companyRepository.save(company);

                Subscription subscription = new Subscription();

                subscription.setCompany(savedCompany);

                subscription.setPlan("PRO");

                subscription.setStatus("TRIAL");

                subscriptionRepository.save(subscription);

                AppUser user = new AppUser();

                user.setCompany(savedCompany);

                user.setEmail(email);

                user.setPasswordHash(
                            passwordEncoder.encode(
                                        request.password()));

                user.setFirstName(
                            request.firstName().trim());

                user.setLastName(
                            request.lastName().trim());

                user.setRole(Role.OWNER);

                user.setActive(true);

                AppUser savedUser = appUserRepository.save(user);

                return new RegisterResponse(
                            savedUser.getIdUser(),
                            savedCompany.getIdCompany(),
                            savedUser.getEmail(),
                            savedUser.getRole().name(),
                            "Account created successfully.");
        }

        public LoginResponse login(
                        LoginRequest request) {

                String email = request.email()
                            .trim()
                            .toLowerCase();

                AppUser user = appUserRepository
                            .findByEmail(email)
                            .orElseThrow(() -> new IllegalArgumentException(
                                        "Invalid email or password."));

                if (!Boolean.TRUE.equals(
                            user.getActive())) {

                        throw new IllegalArgumentException(
                                    "Invalid email or password.");
                }

                if (!passwordEncoder.matches(
                            request.password(),
                            user.getPasswordHash())) {

                        throw new IllegalArgumentException(
                                    "Invalid email or password.");
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
}