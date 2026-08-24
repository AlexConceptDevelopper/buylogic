package com.buylogic.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.consumption.ConsumptionCreateDTO;
import com.buylogic.dto.consumption.ConsumptionDTO;
import com.buylogic.dto.consumption.ConsumptionImportDTO;
import com.buylogic.dto.consumption.ConsumptionImportRowDTO;
import com.buylogic.exception.ConflictException;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.ConsumptionMapper;
import com.buylogic.model.Consumption;
import com.buylogic.model.ImportBatch;
import com.buylogic.model.Product;
import com.buylogic.repository.global.ConsumptionRepository;
import com.buylogic.repository.global.ImportBatchRepository;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConsumptionService {

    private final ConsumptionRepository consumptionRepository;
    private final ConsumptionMapper consumptionMapper;
    private final ProductRepository productRepository;
    private final StockMovementService stockMovementService;
    private final ImportBatchRepository importBatchRepository;
    private final PurchaseRecommendationService purchaseRecommendationService;
    private final ProductionRecommendationService productionRecommendationService;

    public List<ConsumptionDTO> getAll() {
        Integer companyId = getCurrentCompanyId();

        return consumptionRepository
                .findAllByProduct_Company_IdCompany(companyId)
                .stream()
                .map(consumptionMapper::toDTO)
                .toList();
    }

    public ConsumptionDTO getById(Integer id) {
        Integer companyId = getCurrentCompanyId();

        Consumption consumption = consumptionRepository
                .findByIdConsumptionAndProduct_Company_IdCompany(
                        id,
                        companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consumption not found with id: "
                                + id));

        return consumptionMapper.toDTO(consumption);
    }

    @Transactional
    public ConsumptionDTO create(
            ConsumptionCreateDTO dto) {
        Integer companyId = getCurrentCompanyId();

        Product product = productRepository
                .findByIdProductAndCompany_IdCompany(
                        dto.getIdProduct(),
                        companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: "
                                + dto.getIdProduct()));

        Consumption consumption = consumptionMapper.toEntity(
                dto,
                product);

        Consumption savedConsumption = consumptionRepository.save(
                consumption);

        stockMovementService.createSale(
                product.getIdProduct(),
                dto.getQuantity(),
                dto.getSource());

        // Mise à jour de la recommandation d'achat
        purchaseRecommendationService.generateOrUpdateForProduct(
                product.getIdProduct(),
                companyId);

        // Mise à jour de la recommandation de production
        productionRecommendationService.generateOrUpdateForProduct(
                product.getIdProduct(),
                companyId);

        return consumptionMapper.toDTO(
                savedConsumption);
    }

    @Transactional
    public int importBatch(
            ConsumptionImportDTO dto) {
        Integer companyId = getCurrentCompanyId();

        if (dto.getFileHash() == null
                || dto.getFileHash().isBlank()) {

            throw new ConflictException(
                    "Import file hash is required.");
        }

        if (dto.getRows() == null
                || dto.getRows().isEmpty()) {

            throw new ConflictException(
                    "Import contains no rows.");
        }

        if (importBatchRepository
                .findByIdCompanyAndFileHash(
                        companyId,
                        dto.getFileHash())
                .isPresent()) {

            throw new ConflictException(
                    "This file has already been imported.");
        }

        ImportBatch batch = new ImportBatch();

        batch.setIdCompany(companyId);
        batch.setFileName(dto.getFileName());
        batch.setFileHash(dto.getFileHash());
        batch.setImportedCount(dto.getRows().size());

        importBatchRepository.save(batch);

        int importedCount = 0;

        for (ConsumptionImportRowDTO row : dto.getRows()) {

            if (row.getReference() == null
                    || row.getReference().isBlank()) {

                throw new ConflictException(
                        "Product reference is required.");
            }

            if (row.getQuantity() == null
                    || row.getQuantity()
                            .compareTo(BigDecimal.ZERO) <= 0) {

                throw new ConflictException(
                        "Consumption quantity must be greater than zero.");
            }

            if (row.getConsumptionDate() == null) {

                throw new ConflictException(
                        "Consumption date is required.");
            }

            Product product = productRepository
                    .findByReferenceAndCompany_IdCompany(
                            row.getReference().trim(),
                            companyId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with reference: "
                                    + row.getReference()));

            ConsumptionCreateDTO consumptionDTO = new ConsumptionCreateDTO();

            consumptionDTO.setIdProduct(
                    product.getIdProduct());

            consumptionDTO.setQuantity(
                    row.getQuantity());

            consumptionDTO.setConsumptionDate(
                    row.getConsumptionDate());

            consumptionDTO.setSource("IMPORT");

            Consumption consumption = consumptionMapper.toEntity(
                    consumptionDTO,
                    product);

            consumptionRepository.save(consumption);

            stockMovementService.createSale(
                    product.getIdProduct(),
                    row.getQuantity(),
                    dto.getFileName());

            // Génère ou met à jour la recommandation d'achat
            purchaseRecommendationService.generateOrUpdateForProduct(
                    product.getIdProduct(),
                    companyId);

            // Génère ou met à jour la recommandation de production
            productionRecommendationService.generateOrUpdateForProduct(
                    product.getIdProduct(),
                    companyId);

            importedCount++;
        }

        batch.setImportedCount(importedCount);

        importBatchRepository.save(batch);

        return importedCount;
    }

    public List<ConsumptionDTO> getByProductAndPeriod(
            Integer idProduct,
            LocalDate startDate,
            LocalDate endDate) {

        Integer companyId = getCurrentCompanyId();

        if (!productRepository
                .findByIdProductAndCompany_IdCompany(
                        idProduct,
                        companyId)
                .isPresent()) {

            throw new ResourceNotFoundException(
                    "Product not found with id: " + idProduct);
        }

        return consumptionRepository
                .findByProductIdProductAndProduct_Company_IdCompanyAndConsumptionDateBetween(
                        idProduct,
                        companyId,
                        startDate,
                        endDate)
                .stream()
                .map(consumptionMapper::toDTO)
                .toList();
    }

    @Transactional
    public void delete(Integer id) {
        Integer companyId = getCurrentCompanyId();

        Consumption consumption = consumptionRepository
                .findByIdConsumptionAndProduct_Company_IdCompany(
                        id,
                        companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consumption not found with id: "
                                + id));

        consumptionRepository.delete(consumption);
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
}