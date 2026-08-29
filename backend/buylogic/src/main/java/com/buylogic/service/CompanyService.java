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
import com.buylogic.model.Company;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

@Service
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final Cloudinary cloudinary;

    public CompanyService(
            CompanyRepository companyRepository,
            CompanyMapper companyMapper,
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret) {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    public List<CompanyDTO> getAll() {
        Company company = getCurrentCompany();

        return List.of(
                companyMapper.toDTO(company)
        );
    }

    public CompanyDTO getById(Integer id) {
        Company company = getCurrentCompany();

        if (!company.getIdCompany().equals(id)) {
            throw new ResourceNotFoundException(
                    "Company not found with id: " + id
            );
        }

        return companyMapper.toDTO(company);
    }

    @Transactional
    public CompanyDTO create(CompanyCreateDTO dto) {

        if (dto.getEmail() != null
                && !dto.getEmail().isBlank()
                && companyRepository.existsByEmail(dto.getEmail())) {

            throw new ConflictException(
                    "A company with this email already exists."
            );
        }

        Company company = companyMapper.toEntity(dto);

        Company savedCompany =
                companyRepository.save(company);

        return companyMapper.toDTO(savedCompany);
    }

    @Transactional
    public CompanyDTO update(
            Integer id,
            CompanyUpdateDTO dto) {

        Company company = getCurrentCompany();

        if (!company.getIdCompany().equals(id)) {
            throw new ResourceNotFoundException(
                    "Company not found with id: " + id
            );
        }

        if (dto.getEmail() != null
                && !dto.getEmail().isBlank()) {

            boolean emailExists =
                    companyRepository.findByEmail(
                            dto.getEmail()
                    )
                    .filter(existingCompany ->
                            !existingCompany
                                    .getIdCompany()
                                    .equals(id)
                    )
                    .isPresent();

            if (emailExists) {
                throw new ConflictException(
                        "A company with this email already exists."
                );
            }
        }

        companyMapper.updateEntity(
                company,
                dto
        );

        Company updatedCompany =
                companyRepository.save(company);

        return companyMapper.toDTO(updatedCompany);
    }

    @Transactional
    public CompanyDTO updateLogo(Integer id, MultipartFile file) {
        Company company = getCurrentCompany();

        if (!company.getIdCompany().equals(id)) {
            throw new ResourceNotFoundException(
                    "Company not found with id: " + id
            );
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "company_logos",
                    "resource_type", "image"
            ));

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
            throw new ResourceNotFoundException(
                    "Company not found with id: " + id
            );
        }

        companyRepository.delete(company);
    }

    private Company getCurrentCompany() {
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

        return companyRepository
                .findById(principal.companyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated company not found."
                        )
                );
    }
}