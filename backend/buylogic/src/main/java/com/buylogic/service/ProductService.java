package com.buylogic.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.product.ProductCreateDTO;
import com.buylogic.dto.product.ProductDTO;
import com.buylogic.dto.product.ProductUpdateDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.ProductMapper;
import com.buylogic.model.Company;
import com.buylogic.model.Product;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CompanyRepository companyRepository;

    public List<ProductDTO> getAll() {
        Integer companyId = getCurrentCompanyId();

        return productRepository
                .findAllByCompany_IdCompany(companyId)
                .stream()
                .map(productMapper::toDTO)
                .toList();
    }

    public ProductDTO getById(Integer id) {
        Integer companyId = getCurrentCompanyId();

        Product product =
                productRepository
                        .findByIdProductAndCompany_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: " + id
                                )
                        );

        return productMapper.toDTO(product);
    }

    @Transactional
    public ProductDTO create(ProductCreateDTO dto) {

        Company company = getCurrentCompany();

        if (dto.getReference() != null
                && !dto.getReference().isBlank()
                && productRepository
                    .existsByCompanyIdCompanyAndReference(
                        company.getIdCompany(),
                        dto.getReference()
                    )) {

            throw new ConflictException(
                "A product with this reference already exists " +
                "for this company."
            );
        }

        Product product =
                productMapper.toEntity(dto, company);

        Product savedProduct =
                productRepository.save(product);

        return productMapper.toDTO(savedProduct);
    }

    @Transactional
    public ProductDTO update(
            Integer id,
            ProductUpdateDTO dto) {

        Company company = getCurrentCompany();

        Product product =
                productRepository
                        .findByIdProductAndCompany_IdCompany(
                                id,
                                company.getIdCompany()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );

        if (dto.getReference() != null
                && !dto.getReference().isBlank()) {

            boolean referenceExists =
                    productRepository
                            .findByCompanyIdCompanyAndReference(
                                company.getIdCompany(),
                                dto.getReference()
                            )
                            .filter(existingProduct ->
                                !existingProduct
                                    .getIdProduct()
                                    .equals(id)
                            )
                            .isPresent();

            if (referenceExists) {
                throw new ConflictException(
                    "A product with this reference already exists " +
                    "for this company."
                );
            }
        }

        productMapper.updateEntity(
                product,
                dto,
                company
        );

        Product updatedProduct =
                productRepository.save(product);

        return productMapper.toDTO(updatedProduct);
    }

    @Transactional
    public void delete(Integer id) {

        Integer companyId = getCurrentCompanyId();

        Product product =
                productRepository
                        .findByIdProductAndCompany_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + id
                                )
                        );

        productRepository.delete(product);
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