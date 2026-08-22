package com.buylogic.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.product.ProductCreateDTO;
import com.buylogic.dto.product.ProductDTO;
import com.buylogic.dto.product.ProductUpdateDTO;
import com.buylogic.dto.stockmouvement.StockAdjustmentDTO;
import com.buylogic.dto.product.ProductCompositionDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.ProductMapper;
import com.buylogic.model.Company;
import com.buylogic.model.Product;
import com.buylogic.model.ProductComposition;
import com.buylogic.model.StockMovement;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.StockMovementRepository;
import com.buylogic.repository.global.ProductCompositionRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

        private final ProductRepository productRepository;
        private final ProductCompositionRepository productCompositionRepository;
        private final StockMovementRepository stockMovementRepository;
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

                // Traçabilité : si un stock initial est présent à la création
                if (savedProduct.getCurrentStock() != null && savedProduct.getCurrentStock().compareTo(BigDecimal.ZERO) > 0) {
                        recordMovement(savedProduct, "STOCK_INITIAL", savedProduct.getCurrentStock(), dto.getReference());
                }

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
        public ProductDTO adjustStock(Integer id, StockAdjustmentDTO dto) {
                Company company = getCurrentCompany();

                Product product = productRepository.findByIdProductAndCompany_IdCompany(id, company.getIdCompany())
                                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

                BigDecimal oldStock = product.getCurrentStock() != null ? product.getCurrentStock() : BigDecimal.ZERO;
                BigDecimal targetStock = dto.getTargetStock();

                // Calcul de la différence (quantité du mouvement)
                BigDecimal quantityDiff = targetStock.subtract(oldStock);

                if (quantityDiff.compareTo(BigDecimal.ZERO) == 0) {
                        return productMapper.toDTO(product); // Pas de changement
                }

                // 1. Mettre à jour le stock
                product.setCurrentStock(targetStock);
                productRepository.save(product);

                // 2. Enregistrer l'historique dans stock_movement
                recordMovement(product, "ADJUSTMENT", quantityDiff, dto.getReason());

                return productMapper.toDTO(product);
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

                productCompositionRepository.deleteAllByParentProduct_IdProduct(id);
                productRepository.delete(product);
        }

        // --- Méthodes utilitaires ---

        private void recordMovement(Product product, String type, BigDecimal quantity, String reference) {
                StockMovement movement = new StockMovement();
                movement.setProduct(product);
                movement.setMovementType(type);
                movement.setQuantity(quantity);
                movement.setReference(reference);
                stockMovementRepository.save(movement);
        }

        private void saveOrUpdateCompositions(Product parentProduct, List<ProductCompositionDTO> componentDTOs) {
                productCompositionRepository.deleteAllByParentProduct_IdProduct(parentProduct.getIdProduct());

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

                Product parentProduct = productRepository
                                .findByIdProductAndCompany_IdCompany(productId, company.getIdCompany())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: " + productId));

                Product childProduct = productRepository
                                .findByIdProductAndCompany_IdCompany(compDto.getIdChildProduct(),
                                                company.getIdCompany())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Child product not found with id: " + compDto.getIdChildProduct()));

                ProductComposition composition = new ProductComposition();
                composition.setParentProduct(parentProduct);
                composition.setChildProduct(childProduct);
                composition.setQuantity(compDto.getQuantity());

                productCompositionRepository.save(composition);

                Product updatedProduct = productRepository
                                .findByIdProductAndCompany_IdCompany(productId, company.getIdCompany())
                                .orElse(parentProduct);

                return productMapper.toDTO(updatedProduct);
        }

        @Transactional
        public ProductDTO produceProduct(Integer productId, java.math.BigDecimal quantityToProduce) {
                Company company = getCurrentCompany();

                Product parentProduct = productRepository
                                .findByIdProductAndCompany_IdCompany(productId, company.getIdCompany())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: " + productId));

                if (parentProduct.getComponents() == null || parentProduct.getComponents().isEmpty()) {
                        throw new ConflictException("This product has no recipe/components to produce.");
                }

                // 1. Consommation des ingrédients
                for (ProductComposition comp : parentProduct.getComponents()) {
                        Product ingredient = comp.getChildProduct();
                        java.math.BigDecimal totalNeeded = comp.getQuantity().multiply(quantityToProduce);

                        if (ingredient.getCurrentStock().compareTo(totalNeeded) < 0) {
                                throw new ConflictException(
                                                "Stock insuffisant pour l'ingrédient : " + ingredient.getName()
                                                                + " (Requis: " + totalNeeded + ", Disponible: "
                                                                + ingredient.getCurrentStock() + ")");
                        }

                        ingredient.setCurrentStock(ingredient.getCurrentStock().subtract(totalNeeded));
                        productRepository.save(ingredient);

                        // Traçabilité de la consommation
                        recordMovement(ingredient, "CONSUMPTION", totalNeeded.negate(), "Production de " + parentProduct.getName());
                }

                // 2. Production du produit fini
                parentProduct.setCurrentStock(parentProduct.getCurrentStock().add(quantityToProduce));
                Product updatedProduct = productRepository.save(parentProduct);

                // Traçabilité de la production
                recordMovement(updatedProduct, "PRODUCTION", quantityToProduce, "Fabrication interne");

                return productMapper.toDTO(updatedProduct);
        }

        @Transactional
        public ProductDTO removeComponent(Integer productId, Integer childProductId) {
                Company company = getCurrentCompany();

                Product product = productRepository
                                .findByIdProductAndCompany_IdCompany(productId, company.getIdCompany())
                                .orElseThrow(() -> new ResourceNotFoundException("Not found"));

                boolean removed = product.getComponents()
                                .removeIf(c -> c.getChildProduct().getIdProduct().equals(childProductId));

                if (!removed)
                        throw new ResourceNotFoundException("Component not found");

                productRepository.save(product);

                return productMapper.toDTO(product);
        }
}