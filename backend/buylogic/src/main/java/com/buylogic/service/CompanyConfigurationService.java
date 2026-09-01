package com.buylogic.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.company.CompanyConfigurationDTO;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.model.CompanyConfiguration;
import com.buylogic.repository.global.CompanyConfigurationRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyConfigurationService {

    private final CompanyConfigurationRepository companyConfigurationRepository;

    public CompanyConfigurationDTO getCurrent() {
        Integer companyId = getCurrentCompanyId();

        CompanyConfiguration configuration = companyConfigurationRepository
                .findByCompany_IdCompany(companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Company configuration not found."));

        CompanyConfigurationDTO dto = new CompanyConfigurationDTO();
        dto.setIdCompanyConfiguration(configuration.getIdCompanyConfiguration());
        dto.setIdCompany(configuration.getCompany().getIdCompany());
        dto.setProductManagementMode(configuration.getProductManagementMode());

        return dto;
    }

    private Integer getCurrentCompanyId() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) {
            throw new IllegalStateException("Authenticated company not found.");
        }

        return principal.companyId();
    }
}