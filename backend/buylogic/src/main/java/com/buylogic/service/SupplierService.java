package com.buylogic.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.supplier.SupplierCreateDTO;
import com.buylogic.dto.supplier.SupplierDTO;
import com.buylogic.dto.supplier.SupplierUpdateDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.SupplierMapper;
import com.buylogic.model.Company;
import com.buylogic.model.Supplier;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.SupplierRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;
    private final CompanyRepository companyRepository;

    public List<SupplierDTO> getAll() {
        Integer companyId = getCurrentCompanyId();

        return supplierRepository
                .findAllByCompany_IdCompany(companyId)
                .stream()
                .map(supplierMapper::toDTO)
                .toList();
    }

    public SupplierDTO getById(Integer id) {
        Integer companyId = getCurrentCompanyId();

        Supplier supplier =
                supplierRepository
                        .findByIdSupplierAndCompany_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Supplier not found with id: " + id
                                )
                        );

        return supplierMapper.toDTO(supplier);
    }

    @Transactional
    public SupplierDTO create(SupplierCreateDTO dto) {
        Company company = getCurrentCompany();

        if (supplierRepository.existsByCompanyIdCompanyAndName(
                company.getIdCompany(),
                dto.getName())) {

            throw new ConflictException(
                    "A supplier with this name already exists for this company."
            );
        }

        Supplier supplier =
                supplierMapper.toEntity(dto, company);

        Supplier savedSupplier =
                supplierRepository.save(supplier);

        return supplierMapper.toDTO(savedSupplier);
    }

    @Transactional
    public SupplierDTO update(
            Integer id,
            SupplierUpdateDTO dto) {

        Company company = getCurrentCompany();

        Supplier supplier =
                supplierRepository
                        .findByIdSupplierAndCompany_IdCompany(
                                id,
                                company.getIdCompany()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Supplier not found with id: " + id
                                )
                        );

        boolean nameExists =
                supplierRepository
                        .findByCompanyIdCompanyAndName(
                                company.getIdCompany(),
                                dto.getName()
                        )
                        .filter(existingSupplier ->
                                !existingSupplier
                                        .getIdSupplier()
                                        .equals(id)
                        )
                        .isPresent();

        if (nameExists) {
            throw new ConflictException(
                    "A supplier with this name already exists for this company."
            );
        }

        supplierMapper.updateEntity(
                supplier,
                dto,
                company
        );

        Supplier updatedSupplier =
                supplierRepository.save(supplier);

        return supplierMapper.toDTO(updatedSupplier);
    }

    @Transactional
    public void delete(Integer id) {
        Integer companyId = getCurrentCompanyId();

        Supplier supplier =
                supplierRepository
                        .findByIdSupplierAndCompany_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Supplier not found with id: " + id
                                )
                        );

        supplierRepository.delete(supplier);
    }

    private Company getCurrentCompany() {
        Integer companyId = getCurrentCompanyId();

        return companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated company not found."
                        )
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