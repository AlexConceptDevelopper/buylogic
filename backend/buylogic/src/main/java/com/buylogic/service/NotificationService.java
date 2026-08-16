package com.buylogic.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.NotificationDTO;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.NotificationMapper;
import com.buylogic.model.Notification;
import com.buylogic.repository.global.NotificationRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public List<NotificationDTO> getAll() {
        JwtPrincipal principal = getCurrentPrincipal();

        return notificationRepository
                .findAllByUser_IdUserAndUser_Company_IdCompany(
                        principal.userId(),
                        principal.companyId()
                )
                .stream()
                .map(notificationMapper::toDTO)
                .toList();
    }

    public NotificationDTO getById(Integer id) {
        JwtPrincipal principal = getCurrentPrincipal();

        Notification notification =
                notificationRepository
                        .findByIdNotificationAndUser_IdUserAndUser_Company_IdCompany(
                                id,
                                principal.userId(),
                                principal.companyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found with id: "
                                                + id
                                )
                        );

        return notificationMapper.toDTO(notification);
    }

    @Transactional
    public void delete(Integer id) {
        JwtPrincipal principal = getCurrentPrincipal();

        Notification notification =
                notificationRepository
                        .findByIdNotificationAndUser_IdUserAndUser_Company_IdCompany(
                                id,
                                principal.userId(),
                                principal.companyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found with id: "
                                                + id
                                )
                        );

        notificationRepository.delete(notification);
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