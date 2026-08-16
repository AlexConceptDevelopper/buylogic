package com.buylogic.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.supplierproduct.SupplierProductCreateDTO;
import com.buylogic.dto.supplierproduct.SupplierProductDTO;
import com.buylogic.dto.supplierproduct.SupplierProductUpdateDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.SupplierProductMapper;
import com.buylogic.model.Product;
import com.buylogic.model.Supplier;
import com.buylogic.model.SupplierProduct;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.SupplierProductRepository;
import com.buylogic.repository.global.SupplierRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SupplierProductService {

    private final SupplierProductRepository supplierProductRepository;
    private final SupplierProductMapper supplierProductMapper;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public List<SupplierProductDTO> getAll() {
        Integer companyId = getCurrentCompanyId();

        return supplierProductRepository
                .findAllByProduct_Company_IdCompany(companyId)
                .stream()
                .map(supplierProductMapper::toDTO)
                .toList();
    }

    public SupplierProductDTO getById(Integer id) {
        Integer companyId = getCurrentCompanyId();

        SupplierProduct supplierProduct =
                supplierProductRepository
                        .findByIdSupplierProductAndProduct_Company_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "SupplierProduct not found with id: "
                                                + id
                                )
                        );

        return supplierProductMapper.toDTO(supplierProduct);
    }

    @Transactional
    public SupplierProductDTO create(
            SupplierProductCreateDTO dto) {

        Integer companyId = getCurrentCompanyId();

        Product product =
                productRepository
                        .findByIdProductAndCompany_IdCompany(
                                dto.getIdProduct(),
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + dto.getIdProduct()
                                )
                        );

        Supplier supplier =
                supplierRepository
                        .findByIdSupplierAndCompany_IdCompany(
                                dto.getIdSupplier(),
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Supplier not found with id: "
                                                + dto.getIdSupplier()
                                )
                        );

        if (supplierProductRepository
                .existsByProductIdProductAndSupplierIdSupplier(
                        dto.getIdProduct(),
                        dto.getIdSupplier()
                )) {

            throw new ConflictException(
                    "This product is already associated " +
                    "with this supplier."
            );
        }

        SupplierProduct supplierProduct =
                supplierProductMapper.toEntity(
                        dto,
                        product,
                        supplier
                );

        SupplierProduct savedSupplierProduct =
                supplierProductRepository.save(
                        supplierProduct
                );

        return supplierProductMapper.toDTO(
                savedSupplierProduct
        );
    }

    @Transactional
    public SupplierProductDTO update(
            Integer id,
            SupplierProductUpdateDTO dto) {

        Integer companyId = getCurrentCompanyId();

        SupplierProduct supplierProduct =
                supplierProductRepository
                        .findByIdSupplierProductAndProduct_Company_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "SupplierProduct not found with id: "
                                                + id
                                )
                        );

        Product product =
                productRepository
                        .findByIdProductAndCompany_IdCompany(
                                dto.getIdProduct(),
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + dto.getIdProduct()
                                )
                        );

        Supplier supplier =
                supplierRepository
                        .findByIdSupplierAndCompany_IdCompany(
                                dto.getIdSupplier(),
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Supplier not found with id: "
                                                + dto.getIdSupplier()
                                )
                        );

        boolean associationExists =
                supplierProductRepository
                        .findByProductIdProductAndSupplierIdSupplier(
                                dto.getIdProduct(),
                                dto.getIdSupplier()
                        )
                        .filter(existingSupplierProduct ->
                                !existingSupplierProduct
                                        .getIdSupplierProduct()
                                        .equals(id)
                        )
                        .isPresent();

        if (associationExists) {
            throw new ConflictException(
                    "This product is already associated " +
                    "with this supplier."
            );
        }

        supplierProductMapper.updateEntity(
                supplierProduct,
                dto,
                product,
                supplier
        );

        SupplierProduct updatedSupplierProduct =
                supplierProductRepository.save(
                        supplierProduct
                );

        return supplierProductMapper.toDTO(
                updatedSupplierProduct
        );
    }

    @Transactional
    public void delete(Integer id) {
        Integer companyId = getCurrentCompanyId();

        SupplierProduct supplierProduct =
                supplierProductRepository
                        .findByIdSupplierProductAndProduct_Company_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "SupplierProduct not found with id: "
                                                + id
                                )
                        );

        supplierProductRepository.delete(
                supplierProduct
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