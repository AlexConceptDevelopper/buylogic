package com.buylogic.service;

import com.buylogic.dto.appuser.AppUserDTO;
import com.buylogic.dto.appuser.AppUserUpdateDTO;
import com.buylogic.dto.company.CompanyConfigurationDTO;
import com.buylogic.dto.company.CompanyDTO;
import com.buylogic.dto.company.CompanyUpdateDTO;
import com.buylogic.mapper.AppUserMapper;
import com.buylogic.mapper.CompanyMapper;
import com.buylogic.model.AppUser;
import com.buylogic.model.Company;
import com.buylogic.model.CompanyConfiguration;
import com.buylogic.model.enums.Role;
import com.buylogic.repository.global.AppUserRepository;
import com.buylogic.repository.global.CompanyConfigurationRepository;
import com.buylogic.repository.global.CompanyRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CompanyRepository companyRepository;
    private final CompanyConfigurationRepository companyConfigurationRepository;
    private final CompanyMapper companyMapper;

    private final AppUserRepository appUserRepository;
    private final AppUserMapper appUserMapper;

    public AdminService(CompanyRepository companyRepository,
            CompanyConfigurationRepository companyConfigurationRepository,
            CompanyMapper companyMapper,
            AppUserRepository appUserRepository,
            AppUserMapper appUserMapper) {
        this.companyRepository = companyRepository;
        this.companyConfigurationRepository = companyConfigurationRepository;
        this.companyMapper = companyMapper;
        this.appUserRepository = appUserRepository;
        this.appUserMapper = appUserMapper;
    }

    // ==========================================
    // SECTION : GESTION DES ENTREPRISES (COMPANY)
    // ==========================================

    public List<CompanyDTO> findAllCompanies() {
        return companyRepository.findAll().stream()
                .map(companyMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CompanyDTO findCompanyById(Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise introuvable avec l'ID : " + id));
        return companyMapper.toDTO(company);
    }

    @Transactional
    public CompanyDTO updateCompany(Integer id, CompanyUpdateDTO dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise introuvable avec l'ID : " + id));

        companyMapper.updateEntity(company, dto);

        if (dto.getActive() != null) {
            company.setActive(dto.getActive());
        }

        Company updated = companyRepository.save(company);

        return companyMapper.toDTO(updated);
    }

    @Transactional
    public void deleteCompany(Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise introuvable avec l'ID : " + id));

        company.setActive(false);
        companyRepository.save(company);
    }

    // ==========================================
    // SECTION : GESTION DES UTILISATEURS (USERS)
    // ==========================================

    @Transactional(readOnly = true)
    public List<AppUserDTO> findAllUsers() {
        return appUserRepository.findAll().stream()
                .map(appUserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppUserDTO updateUser(Integer id, AppUserUpdateDTO dto) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));

        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getDepartment() != null) {
            user.setDepartment(dto.getDepartment());
        }
        if (dto.getRole() != null) {
            user.setRole(Role.valueOf(dto.getRole()));
        }
        if (dto.getActive() != null) {
            user.setActive(dto.getActive());
        }

        AppUser updated = appUserRepository.save(user);
        return appUserMapper.toDTO(updated);
    }

    @Transactional
    public void deleteUser(Integer id) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));

        // Soft delete : on désactive l'utilisateur
        user.setActive(false);
        appUserRepository.save(user);
    }

    // ==========================================
    // SECTION : GESTION DE LA CONFIGURATION
    // ==========================================

    public CompanyConfigurationDTO getCompanyConfigurationByCompanyId(Integer idCompany) {
        CompanyConfiguration config = companyConfigurationRepository.findByCompany_IdCompany(idCompany)
                .orElseThrow(
                        () -> new RuntimeException("Configuration introuvable pour l'entreprise ID : " + idCompany));

        return mapToConfigurationDTO(config);
    }

    @Transactional
    public CompanyConfigurationDTO updateCompanyConfiguration(Integer idCompany, CompanyConfigurationDTO dto) {
        CompanyConfiguration config = companyConfigurationRepository.findByCompany_IdCompany(idCompany)
                .orElseGet(() -> {
                    Company company = companyRepository.findById(idCompany)
                            .orElseThrow(() -> new RuntimeException("Entreprise introuvable avec l'ID : " + idCompany));
                    CompanyConfiguration newConfig = new CompanyConfiguration();
                    newConfig.setCompany(company);
                    return newConfig;
                });

        config.setProductManagementMode(dto.getProductManagementMode());
        CompanyConfiguration saved = companyConfigurationRepository.save(config);

        return mapToConfigurationDTO(saved);
    }

    // ==========================================
    // SECTION : MAPPERS INTERNES
    // ==========================================

    private CompanyConfigurationDTO mapToConfigurationDTO(CompanyConfiguration config) {
        CompanyConfigurationDTO dto = new CompanyConfigurationDTO();
        dto.setIdCompanyConfiguration(config.getIdCompanyConfiguration());
        dto.setIdCompany(config.getCompany() != null ? config.getCompany().getIdCompany() : null);
        dto.setProductManagementMode(config.getProductManagementMode());
        return dto;
    }
}