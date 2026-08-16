package com.buylogic.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.PurchaseRecommendationDTO;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.PurchaseRecommendationMapper;
import com.buylogic.model.PurchaseRecommendation;
import com.buylogic.repository.global.PurchaseRecommendationRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseRecommendationService {

    private final PurchaseRecommendationRepository purchaseRecommendationRepository;
    private final PurchaseRecommendationMapper purchaseRecommendationMapper;

    public List<PurchaseRecommendationDTO> getAll() {
        Integer companyId = getCurrentCompanyId();

        return purchaseRecommendationRepository
                .findAllByCompany_IdCompany(companyId)
                .stream()
                .map(purchaseRecommendationMapper::toDTO)
                .toList();
    }

    public PurchaseRecommendationDTO getById(Integer id) {
        Integer companyId = getCurrentCompanyId();

        PurchaseRecommendation recommendation =
                purchaseRecommendationRepository
                        .findByIdRecommendationAndCompany_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase recommendation not found with id: "
                                                + id
                                )
                        );

        return purchaseRecommendationMapper.toDTO(
                recommendation
        );
    }

    @Transactional
    public void delete(Integer id) {
        Integer companyId = getCurrentCompanyId();

        PurchaseRecommendation recommendation =
                purchaseRecommendationRepository
                        .findByIdRecommendationAndCompany_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase recommendation not found with id: "
                                                + id
                                )
                        );

        purchaseRecommendationRepository.delete(
                recommendation
        );
    }

    private Integer getCurrentCompanyId() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal()
                instanceof JwtPrincipal principal)) {

            throw new IllegalStateException(
                    "Authenticated company not found."
            );
        }

        return principal.companyId();
    }
}