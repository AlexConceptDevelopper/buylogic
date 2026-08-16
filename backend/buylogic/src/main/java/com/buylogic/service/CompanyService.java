package com.buylogic.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.company.CompanyCreateDTO;
import com.buylogic.dto.company.CompanyDTO;
import com.buylogic.dto.company.CompanyUpdateDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.CompanyMapper;
import com.buylogic.model.Company;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

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