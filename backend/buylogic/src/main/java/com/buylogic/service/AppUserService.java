package com.buylogic.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.appuser.AppUserCreateDTO;
import com.buylogic.dto.appuser.AppUserDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.AppUserMapper;
import com.buylogic.model.AppUser;
import com.buylogic.model.Company;
import com.buylogic.model.enums.Role;
import com.buylogic.repository.global.AppUserRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final AppUserMapper appUserMapper;
    private final PasswordEncoder passwordEncoder;

    public List<AppUserDTO> getAll() {
        JwtPrincipal principal = getCurrentPrincipal();

        return appUserRepository
                .findAllByCompany_IdCompany(
                        principal.companyId()
                )
                .stream()
                .map(appUserMapper::toDTO)
                .toList();
    }

    public AppUserDTO getById(Integer id) {
        JwtPrincipal principal = getCurrentPrincipal();

        AppUser user =
                appUserRepository
                        .findByIdUserAndCompany_IdCompany(
                                id,
                                principal.companyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with id: " + id
                                )
                        );

        return appUserMapper.toDTO(user);
    }

    public AppUserDTO getMe() {
        JwtPrincipal principal = getCurrentPrincipal();

        AppUser user =
                appUserRepository
                        .findByIdUserAndCompany_IdCompany(
                                principal.userId(),
                                principal.companyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Authenticated user not found."
                                )
                        );

        return appUserMapper.toDTO(user);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER')")
    @Transactional
    public AppUserDTO create(AppUserCreateDTO dto) {

        JwtPrincipal principal = getCurrentPrincipal();

        String email = dto.getEmail()
                .trim()
                .toLowerCase();

        if (appUserRepository.existsByEmail(email)) {
            throw new ConflictException(
                    "A user with this email already exists."
            );
        }

        Role role;

        try {
            role = Role.valueOf(
                    dto.getRole()
                            .trim()
                            .toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid user role."
            );
        }

        if (principal.role().equals("OWNER")
                && role != Role.USER
                && role != Role.MANAGER) {

            throw new IllegalArgumentException(
                    "An OWNER can only create USER or MANAGER accounts."
            );
        }

        AppUser user = new AppUser();
        user.setCompany(getCurrentCompany());

        user.setEmail(email);

        user.setPasswordHash(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );

        user.setFirstName(
                dto.getFirstName().trim()
        );

        user.setLastName(
                dto.getLastName().trim()
        );

        user.setRole(role);
        user.setActive(true);

        AppUser savedUser =
                appUserRepository.save(user);

        return appUserMapper.toDTO(savedUser);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER')")
    @Transactional
    public void delete(Integer id) {

        JwtPrincipal principal = getCurrentPrincipal();

        AppUser user;

        if (principal.role().equals("SUPER_ADMIN")) {

            user = appUserRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found with id: " + id
                            )
                    );

        } else {

            user = appUserRepository
                    .findByIdUserAndCompany_IdCompany(
                            id,
                            principal.companyId()
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found with id: " + id
                            )
                    );
        }

        appUserRepository.delete(user);
    }

    private Company getCurrentCompany() {
        JwtPrincipal principal = getCurrentPrincipal();

        AppUser currentUser =
                appUserRepository
                        .findByIdUserAndCompany_IdCompany(
                                principal.userId(),
                                principal.companyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Authenticated company not found."
                                )
                        );

        return currentUser.getCompany();
    }

    private JwtPrincipal getCurrentPrincipal() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal()
                instanceof JwtPrincipal principal)) {

            throw new IllegalStateException(
                    "Authenticated user not found."
            );
        }

        return principal;
    }
}