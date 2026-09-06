package com.buylogic.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.buylogic.dto.company.CompanyCreateDTO;
import com.buylogic.dto.company.CompanyDTO;
import com.buylogic.dto.company.CompanyUpdateDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.CompanyMapper;
import com.buylogic.model.AuditLog;
import com.buylogic.model.Company;
import com.buylogic.repository.global.AuditLogRepository;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

@Service
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final Cloudinary cloudinary;
    private final StripeService stripeService;
    private final AuditLogRepository auditLogRepository;

    public CompanyService(
            CompanyRepository companyRepository,
            CompanyMapper companyMapper,
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret,
            StripeService stripeService,
            AuditLogRepository auditLogRepository) {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
        this.stripeService = stripeService;
        this.auditLogRepository = auditLogRepository;
    }

    public List<CompanyDTO> getAll() {
        Company company = getCurrentCompany();

        return List.of(
                companyMapper.toDTO(company));
    }

    public CompanyDTO getById(Integer id) {
        Company company = getCurrentCompany();

        if (!company.getIdCompany().equals(id)) {
            throw new ResourceNotFoundException(
                    "Company not found with id: " + id);
        }

        return companyMapper.toDTO(company);
    }

    @Transactional
    public CompanyDTO create(CompanyCreateDTO dto) {

        if (dto.getEmail() != null
                && !dto.getEmail().isBlank()
                && companyRepository.existsByEmail(dto.getEmail())) {

            throw new ConflictException(
                    "A company with this email already exists.");
        }

        Company company = companyMapper.toEntity(dto);

        Company savedCompany = companyRepository.save(company);

        return companyMapper.toDTO(savedCompany);
    }

    @Transactional
    public CompanyDTO update(
            Integer id,
            CompanyUpdateDTO dto) {

        Company company = getCurrentCompany();

        if (!company.getIdCompany().equals(id)) {
            throw new ResourceNotFoundException(
                    "Company not found with id: " + id);
        }

        if (dto.getEmail() != null
                && !dto.getEmail().isBlank()) {

            boolean emailExists = companyRepository.findByEmail(
                    dto.getEmail())
                    .filter(existingCompany -> !existingCompany
                            .getIdCompany()
                            .equals(id))
                    .isPresent();

            if (emailExists) {
                throw new ConflictException(
                        "A company with this email already exists.");
            }
        }

        companyMapper.updateEntity(
                company,
                dto);

        Company updatedCompany = companyRepository.save(company);

        return companyMapper.toDTO(updatedCompany);
    }

    @Transactional
    public CompanyDTO updateLogo(Integer id, MultipartFile file) {
        Company company = getCurrentCompany();

        if (!company.getIdCompany().equals(id)) {
            throw new ResourceNotFoundException(
                    "Company not found with id: " + id);
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "company_logos",
                    "resource_type", "image"));

            String logoUrl = uploadResult.get("secure_url").toString();

            company.setLogoUrl(logoUrl);
            Company savedCompany = companyRepository.save(company);

            return companyMapper.toDTO(savedCompany);

        } catch (IOException e) {
            throw new RuntimeException("Échec de l'upload du logo vers Cloudinary", e);
        }
    }

    @Transactional
    public void delete(Integer id) {
        Company company = getCurrentCompany();

        if (!company.getIdCompany().equals(id)) {
            throw new ResourceNotFoundException("Company not found with id: " + id);
        }

        String companyName = company.getName();
        Integer companyId = company.getIdCompany();

        // 1. Résiliation de l'abonnement actif sur Stripe s'il existe
        if (company.getSubscription() != null && company.getSubscription().getStripeSubscriptionId() != null) {
            stripeService.cancelSubscription(company.getSubscription().getStripeSubscriptionId());
        }

        // 2. Nettoyage du logo Cloudinary si présent
        if (company.getLogoUrl() != null && !company.getLogoUrl().isBlank()) {
            try {
                int uploadIndex = company.getLogoUrl().indexOf("/upload/");
                if (uploadIndex != -1) {
                    String pathAfterUpload = company.getLogoUrl().substring(uploadIndex + 8);
                    if (pathAfterUpload.matches("^v\\d+/.+")) {
                        pathAfterUpload = pathAfterUpload
                                .substring(pathAfterUpload.indexOf("/") + 1);
                    }
                    int lastDot = pathAfterUpload.lastIndexOf('.');
                    if (lastDot != -1) {
                        pathAfterUpload = pathAfterUpload.substring(0, lastDot);
                    }
                    cloudinary.uploader().destroy(pathAfterUpload, ObjectUtils.emptyMap());
                }
            } catch (Exception e) {
                e.printStackTrace(); // On log l'erreur technique sans bloquer la suppression
            }
        }

        // 3. Suppression définitive en cascade
        companyRepository.delete(company);

        // 📝 4. Log d'audit pour tracer la suppression complète de l'entreprise
        AuditLog auditLog = new AuditLog();
        auditLog.setAction("COMPANY_DELETED");
        auditLog.setActor(company.getEmail());
        auditLog.setIpAddress("System");
        auditLog.setStatus(AuditLog.AuditStatus.SUCCESS);
        auditLog.setDetails(String.format(
                "Suppression définitive de l'entreprise ID %d (%s) et de toutes ses données associées (RGPD).",
                companyId, companyName));
        auditLogRepository.save(auditLog);
    }

    private Company getCurrentCompany() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) {

            throw new IllegalStateException(
                    "Authenticated company not found.");
        }

        return companyRepository
                .findById(principal.companyId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated company not found."));
    }
}