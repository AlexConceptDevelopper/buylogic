package com.buylogic.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.product.ProductCreateDTO;
import com.buylogic.dto.product.ProductDTO;
import com.buylogic.dto.product.ProductUpdateDTO;
import com.buylogic.dto.product.ProductCompositionDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.ProductMapper;
import com.buylogic.model.Company;
import com.buylogic.model.Product;
import com.buylogic.model.ProductComposition;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.ProductCompositionRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

        private final ProductRepository productRepository;
        private final ProductCompositionRepository productCompositionRepository; // Injecté ici
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

                Product product = productRepository
                                .findByIdProductAndCompany_IdCompany(
                                                id,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: " + id));

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
                                                                dto.getReference())) {

                        throw new ConflictException(
                                        "A product with this reference already exists " +
                                                        "for this company.");
                }

                Product product = productMapper.toEntity(dto, company);

                Product savedProduct = productRepository.save(product);

                // Gestion de la composition si le DTO contient des composants
                saveOrUpdateCompositions(savedProduct, dto.getComponents());

                return productMapper.toDTO(savedProduct);
        }

        @Transactional
        public ProductDTO update(
                        Integer id,
                        ProductUpdateDTO dto) {

                Company company = getCurrentCompany();

                Product product = productRepository
                                .findByIdProductAndCompany_IdCompany(
                                                id,
                                                company.getIdCompany())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: "
                                                                + id));

                if (dto.getReference() != null
                                && !dto.getReference().isBlank()) {

                        boolean referenceExists = productRepository
                                        .findByCompanyIdCompanyAndReference(
                                                        company.getIdCompany(),
                                                        dto.getReference())
                                        .filter(existingProduct -> !existingProduct
                                                        .getIdProduct()
                                                        .equals(id))
                                        .isPresent();

                        if (referenceExists) {
                                throw new ConflictException(
                                                "A product with this reference already exists " +
                                                                "for this company.");
                        }
                }

                productMapper.updateEntity(
                                product,
                                dto,
                                company);

                Product updatedProduct = productRepository.save(product);

                // Mise à jour de la composition
                saveOrUpdateCompositions(updatedProduct, dto.getComponents());

                return productMapper.toDTO(updatedProduct);
        }

        @Transactional
        public void delete(Integer id) {

                Integer companyId = getCurrentCompanyId();

                Product product = productRepository
                                .findByIdProductAndCompany_IdCompany(
                                                id,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: "
                                                                + id));

                // Nettoyer d'abord les compositions si besoin (ou laisser faire la cascade en
                // base)
                productCompositionRepository.deleteAllByParentProduct_IdProduct(id);

                productRepository.delete(product);
        }

        // Méthode utilitaire privée pour gérer l'enregistrement des composants
        private void saveOrUpdateCompositions(Product parentProduct, List<ProductCompositionDTO> componentDTOs) {
                // 1. On supprime les anciennes compositions de ce produit
                productCompositionRepository.deleteAllByParentProduct_IdProduct(parentProduct.getIdProduct());

                // 2. Si de nouveaux composants sont fournis, on les enregistre
                if (componentDTOs != null && !componentDTOs.isEmpty()) {
                        for (ProductCompositionDTO compDto : componentDTOs) {
                                Product childProduct = productRepository
                                                .findByIdProductAndCompany_IdCompany(
                                                                compDto.getIdChildProduct(),
                                                                parentProduct.getCompany().getIdCompany())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Child product not found with id: "
                                                                                + compDto.getIdChildProduct()));

                                ProductComposition composition = new ProductComposition();
                                composition.setParentProduct(parentProduct);
                                composition.setChildProduct(childProduct);
                                composition.setQuantity(compDto.getQuantity());

                                productCompositionRepository.save(composition);
                        }
                }
        }

        private Company getCurrentCompany() {
                Integer companyId = getCurrentCompanyId();

                return companyRepository
                                .findById(companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Authenticated company not found."));
        }

        private Integer getCurrentCompanyId() {
                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                if (authentication == null
                                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) {

                        throw new IllegalStateException(
                                        "Authenticated company not found.");
                }

                return principal.companyId();
        }

        @Transactional
        public ProductDTO addComponent(Integer productId, ProductCompositionDTO compDto) {
                Company company = getCurrentCompany();

                // 1. Récupérer le produit parent et s'assurer qu'il appartient à l'entreprise
                Product parentProduct = productRepository
                                .findByIdProductAndCompany_IdCompany(productId, company.getIdCompany())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: " + productId));

                // 2. Récupérer le produit enfant (l'ingrédient)
                Product childProduct = productRepository
                                .findByIdProductAndCompany_IdCompany(compDto.getIdChildProduct(),
                                                company.getIdCompany())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Child product not found with id: " + compDto.getIdChildProduct()));

                // 3. Créer et enregistrer la composition
                ProductComposition composition = new ProductComposition();
                composition.setParentProduct(parentProduct);
                composition.setChildProduct(childProduct);
                composition.setQuantity(compDto.getQuantity());

                productCompositionRepository.save(composition);

                // 4. Recharger ou récupérer le produit mis à jour pour le renvoyer en DTO
                // (S'assurer que la liste des composants est bien rafraîchie ou gérée par le
                // mapper)
                Product updatedProduct = productRepository
                                .findByIdProductAndCompany_IdCompany(productId, company.getIdCompany())
                                .orElse(parentProduct);

                return productMapper.toDTO(updatedProduct);
        }
}