package com.buylogic.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.stockmouvement.StockAdjustmentDTO;
import com.buylogic.dto.stockmouvement.StockMovementCreateDTO;
import com.buylogic.dto.stockmouvement.StockMovementDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.StockMovementMapper;
import com.buylogic.model.Product;
import com.buylogic.model.StockMovement;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.StockMovementRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StockMovementService {

        private final StockMovementRepository stockMovementRepository;
        private final StockMovementMapper stockMovementMapper;
        private final ProductRepository productRepository;

        public List<StockMovementDTO> getAll() {

                Integer companyId = getCurrentCompanyId();

                return stockMovementRepository
                                .findAllByProduct_Company_IdCompany(companyId)
                                .stream()
                                .map(stockMovementMapper::toDTO)
                                .toList();
        }

        public StockMovementDTO getById(Integer id) {

                Integer companyId = getCurrentCompanyId();

                StockMovement movement = stockMovementRepository
                                .findByIdStockMovementAndProduct_Company_IdCompany(
                                                id,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Stock movement not found with id: "
                                                                + id));

                return stockMovementMapper.toDTO(movement);
        }

        @Transactional
        public StockMovementDTO create(
                        StockMovementCreateDTO dto) {

                Integer companyId = getCurrentCompanyId();

                Product product = productRepository
                                .findByIdProductAndCompany_IdCompany(
                                                dto.getIdProduct(),
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: "
                                                                + dto.getIdProduct()));

                String movementType = dto.getMovementType()
                                .toUpperCase();

                if (!isValidMovementType(movementType)) {
                        throw new ConflictException(
                                        "Invalid stock movement type: "
                                                        + movementType);
                }

                validateQuantity(
                                movementType,
                                dto.getQuantity());

                BigDecimal newStock = product.getCurrentStock()
                                .add(dto.getQuantity());

                if (newStock.compareTo(
                                BigDecimal.ZERO) < 0) {

                        throw new ConflictException(
                                        "Insufficient stock for product: "
                                                        + product.getName());
                }

                StockMovement movement = stockMovementMapper.toEntity(
                                dto,
                                product);

                StockMovement savedMovement = stockMovementRepository.save(
                                movement);

                product.setCurrentStock(newStock);

                productRepository.save(product);

                return stockMovementMapper.toDTO(
                                savedMovement);
        }

        @Transactional
        public StockMovementDTO adjustStock(
                        Integer idProduct,
                        StockAdjustmentDTO dto) {

                assertOwner();

                Integer companyId = getCurrentCompanyId();

                Product product = productRepository
                                .findByIdProductAndCompany_IdCompany(
                                                idProduct,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found with id: "
                                                                + idProduct));

                BigDecimal currentStock = product.getCurrentStock();

                BigDecimal targetStock = dto.getTargetStock();

                BigDecimal difference = targetStock.subtract(currentStock);

                if (difference.compareTo(
                                BigDecimal.ZERO) == 0) {

                        throw new ConflictException(
                                        "The target stock is the same as the current stock.");
                }

                StockMovementCreateDTO movementDTO = new StockMovementCreateDTO();

                movementDTO.setIdProduct(
                                product.getIdProduct());

                movementDTO.setMovementType(
                                "ADJUSTMENT");

                movementDTO.setQuantity(
                                difference);

                movementDTO.setReference(
                                dto.getReason().trim());

                return create(movementDTO);
        }

        @Transactional
        public void delete(Integer id) {

                Integer companyId = getCurrentCompanyId();

                StockMovement movement = stockMovementRepository
                                .findByIdStockMovementAndProduct_Company_IdCompany(
                                                id,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Stock movement not found with id: "
                                                                + id));

                Product product = movement.getProduct();

                BigDecimal newStock = product.getCurrentStock()
                                .subtract(
                                                movement.getQuantity());

                if (newStock.compareTo(
                                BigDecimal.ZERO) < 0) {

                        throw new ConflictException(
                                        "Cannot delete this movement because "
                                                        + "it would result in negative stock.");
                }

                product.setCurrentStock(newStock);

                productRepository.save(product);

                stockMovementRepository.delete(
                                movement);
        }

        private boolean isValidMovementType(
                        String movementType) {

                return switch (movementType) {
                        case "PURCHASE",
                                        "SALE",
                                        "ADJUSTMENT",
                                        "RETURN",
                                        "LOSS",
                                        "TRANSFER" ->
                                true;

                        default ->
                                false;
                };
        }

        private void validateQuantity(
                        String movementType,
                        BigDecimal quantity) {

                boolean quantityMustBePositive = movementType.equals("PURCHASE")
                                || movementType.equals("RETURN");

                boolean quantityMustBeNegative = movementType.equals("SALE")
                                || movementType.equals("LOSS");

                if (quantityMustBePositive
                                && quantity.compareTo(
                                                BigDecimal.ZERO) <= 0) {

                        throw new ConflictException(
                                        movementType
                                                        + " movement quantity must be positive.");
                }

                if (quantityMustBeNegative
                                && quantity.compareTo(
                                                BigDecimal.ZERO) >= 0) {

                        throw new ConflictException(
                                        movementType
                                                        + " movement quantity must be negative.");
                }
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

        private void assertOwner() {

                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                if (authentication == null
                                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) {

                        throw new IllegalStateException(
                                        "Authenticated user not found.");
                }

                if (!"OWNER".equals(
                                principal.role())) {

                        throw new org.springframework.security.access.AccessDeniedException(
                                        "Only the company owner can adjust stock.");
                }
        }

        @Transactional
        public StockMovementDTO createSale(
                        Integer idProduct,
                        BigDecimal quantity,
                        String reference) {

                if (quantity == null
                                || quantity.compareTo(
                                                BigDecimal.ZERO) <= 0) {

                        throw new ConflictException(
                                        "Sale quantity must be greater than zero.");
                }

                StockMovementCreateDTO dto = new StockMovementCreateDTO();

                dto.setIdProduct(idProduct);

                dto.setMovementType("SALE");

                dto.setQuantity(
                                quantity.negate());

                dto.setReference(reference);

                return create(dto);
        }
}