package com.buylogic.service;

import com.buylogic.dto.appuser.AppUserDTO;
import com.buylogic.dto.appuser.AppUserUpdateDTO;
import com.buylogic.dto.AuditLogResponseDto;
import com.buylogic.dto.company.CompanyConfigurationDTO;
import com.buylogic.dto.company.CompanyDTO;
import com.buylogic.dto.company.CompanyUpdateDTO;
import com.buylogic.mapper.AppUserMapper;
import com.buylogic.mapper.CompanyMapper;
import com.buylogic.model.AppUser;
import com.buylogic.model.AuditLog;
import com.buylogic.model.Company;
import com.buylogic.model.CompanyConfiguration;
import com.buylogic.model.enums.ProductManagementMode;
import com.buylogic.model.enums.Role;
import com.buylogic.repository.global.AppUserRepository;
import com.buylogic.repository.global.AuditLogRepository;
import com.buylogic.repository.global.CompanyConfigurationRepository;
import com.buylogic.repository.global.CompanyRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CompanyRepository companyRepository;
    private final CompanyConfigurationRepository companyConfigurationRepository;
    private final CompanyMapper companyMapper;

    private final AppUserRepository appUserRepository;
    private final AppUserMapper appUserMapper;

    private final AuditLogRepository auditLogRepository;

    public AdminService(CompanyRepository companyRepository,
            CompanyConfigurationRepository companyConfigurationRepository,
            CompanyMapper companyMapper,
            AppUserRepository appUserRepository,
            AppUserMapper appUserMapper,
            AuditLogRepository auditLogRepository) {
        this.companyRepository = companyRepository;
        this.companyConfigurationRepository = companyConfigurationRepository;
        this.companyMapper = companyMapper;
        this.appUserRepository = appUserRepository;
        this.appUserMapper = appUserMapper;
        this.auditLogRepository = auditLogRepository;
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

        // Captures des anciennes valeurs pour comparaison
        String oldName = company.getName();
        Boolean oldActive = company.getActive();

        companyMapper.updateEntity(company, dto);

        if (dto.getActive() != null) {
            company.setActive(dto.getActive());
        }

        Company updated = companyRepository.save(company);

        // Construction dynamique des détails de modification
        List<String> changes = new ArrayList<>();
        if (dto.getName() != null && !oldName.equals(company.getName())) {
            changes.add(String.format("Nom: '%s' -> '%s'", oldName, company.getName()));
        }
        if (dto.getActive() != null && !oldActive.equals(company.getActive())) {
            changes.add(String.format("Actif: %s -> %s", oldActive, company.getActive()));
        }
        String details = changes.isEmpty() ? "Mise à jour sans modification détectée" : String.join(", ", changes);

        // 📝 Log d'audit détaillé
        createAuditLog(
                "COMPANY_UPDATED",
                "SuperAdmin",
                "Internal",
                AuditLog.AuditStatus.SUCCESS,
                String.format("Entreprise ID %d (%s) - Modifications: %s", id, oldName, details));

        return companyMapper.toDTO(updated);
    }

    @Transactional
    public void deleteCompany(Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise introuvable avec l'ID : " + id));

        company.setActive(false);
        companyRepository.save(company);

        // 📝 Log d'audit
        createAuditLog(
                "COMPANY_DELETED",
                "SuperAdmin",
                "Internal",
                AuditLog.AuditStatus.WARNING,
                "Soft delete (désactivation) de l'entreprise : " + company.getName() + " (ID: " + id + ")");
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

        // Captures des anciennes valeurs
        String oldFirstName = user.getFirstName();
        String oldLastName = user.getLastName();
        String oldDepartment = user.getDepartment();
        Role oldRole = user.getRole();
        Boolean oldActive = user.getActive();

        List<String> changes = new ArrayList<>();

        if (dto.getFirstName() != null && !dto.getFirstName().equals(oldFirstName)) {
            changes.add(String.format("Prénom: '%s' -> '%s'", oldFirstName, dto.getFirstName()));
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null && !dto.getLastName().equals(oldLastName)) {
            changes.add(String.format("Nom: '%s' -> '%s'", oldLastName, dto.getLastName()));
            user.setLastName(dto.getLastName());
        }
        if (dto.getDepartment() != null && !dto.getDepartment().equals(oldDepartment)) {
            changes.add(String.format("Département: '%s' -> '%s'", oldDepartment, dto.getDepartment()));
            user.setDepartment(dto.getDepartment());
        }
        if (dto.getRole() != null) {
            Role newRole = Role.valueOf(dto.getRole());
            if (newRole != oldRole) {
                changes.add(String.format("Rôle: %s -> %s", oldRole, newRole));
                user.setRole(newRole);
            }
        }
        if (dto.getActive() != null && !dto.getActive().equals(oldActive)) {
            changes.add(String.format("Actif: %s -> %s", oldActive, dto.getActive()));
            user.setActive(dto.getActive());
        }

        AppUser updated = appUserRepository.save(user);

        String details = changes.isEmpty() ? "Mise à jour sans changement apparent" : String.join(", ", changes);

        // 📝 Log d'audit détaillé
        createAuditLog(
                "USER_UPDATED",
                "SuperAdmin",
                "Internal",
                AuditLog.AuditStatus.SUCCESS,
                String.format("Utilisateur ID %d (%s) - Modifications: %s", id, user.getEmail(), details));

        return appUserMapper.toDTO(updated);
    }

    @Transactional
    public void deleteUser(Integer id) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));

        // Soft delete : on désactive l'utilisateur
        user.setActive(false);
        appUserRepository.save(user);

        // 📝 Log d'audit
        createAuditLog(
                "USER_DELETED",
                "SuperAdmin",
                "Internal",
                AuditLog.AuditStatus.WARNING,
                "Soft delete (désactivation) de l'utilisateur : " + user.getEmail() + " (ID: " + id + ")");
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

        ProductManagementMode oldMode = config.getProductManagementMode();
        ProductManagementMode newMode = dto.getProductManagementMode();

        // Si la valeur est strictement identique, on ne fait rien (pas de MàJ inutile, pas de log)
        if (oldMode != null && oldMode.equals(newMode)) {
            return mapToConfigurationDTO(config);
        }

        config.setProductManagementMode(newMode);
        CompanyConfiguration saved = companyConfigurationRepository.save(config);

        String oldModeStr = oldMode != null ? oldMode.name() : "Aucun";
        String newModeStr = newMode != null ? newMode.name() : "Aucun";

        String details = String.format("Mode de gestion des produits : '%s' -> '%s'", oldModeStr, newModeStr);

        // 📝 Log d'audit détaillé (uniquement si changement réel)
        createAuditLog(
            "COMPANY_CONFIGURATION_UPDATED",
            "SuperAdmin",
            "Internal",
            AuditLog.AuditStatus.SUCCESS,
            String.format("Configuration de l'entreprise ID %d - %s", idCompany, details)
        );

        return mapToConfigurationDTO(saved);
    }

    // ==========================================
    // SECTION : GESTION DES LOGS D'AUDIT
    // ==========================================

    @Transactional(readOnly = true)
    public List<AuditLogResponseDto> findAllAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AuditLogResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void createAuditLog(String action, String actor, String ipAddress, AuditLog.AuditStatus status,
            String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setActor(actor);
        log.setIpAddress(ipAddress);
        log.setStatus(status);
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    @Transactional
    public void deleteAuditLog(Long id) {
        if (!auditLogRepository.existsById(id)) {
            throw new RuntimeException("Journal d'audit introuvable avec l'ID : " + id);
        }
        auditLogRepository.deleteById(id);
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