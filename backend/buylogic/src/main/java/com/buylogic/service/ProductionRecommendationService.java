package com.buylogic.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.ProductionRecommendationDTO;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.ProductionRecommendationMapper;
import com.buylogic.model.Consumption;
import com.buylogic.model.Product;
import com.buylogic.model.ProductionRecommendation;
import com.buylogic.repository.global.ConsumptionRepository;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.ProductionRecommendationRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductionRecommendationService {

    private final ProductRepository productRepository;
    private final ProductionRecommendationRepository productionRecommendationRepository;
    private final ConsumptionRepository consumptionRepository;
    private final ProductionRecommendationMapper productionRecommendationMapper;

    private static final BigDecimal SAFETY_DAYS = new BigDecimal("2");
    private static final BigDecimal TARGET_COVERAGE_DAYS = new BigDecimal("7");

    public List<ProductionRecommendationDTO> getAll() {
        Integer companyId = getCurrentCompanyId();

        return productionRecommendationRepository.findAllByCompany_IdCompany(companyId)
                .stream()
                .map(recommendation -> {
                    updateRecommendationValues(recommendation, companyId);
                    return productionRecommendationMapper.toDTO(recommendation);
                })
                .toList();
    }

    public ProductionRecommendationDTO getById(Integer id) {
        Integer companyId = getCurrentCompanyId();

        ProductionRecommendation recommendation = productionRecommendationRepository
                .findByIdProductionRecommendationAndCompany_IdCompany(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Production recommendation not found with id: " + id));

        updateRecommendationValues(recommendation, companyId);
        return productionRecommendationMapper.toDTO(recommendation);
    }

    @Transactional
    public void generateOrUpdateForProduct(Integer productId, Integer companyId) {
        Product product = productRepository.findByIdProductAndCompany_IdCompany(productId, companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + productId));

        ProductionRecommendation recommendation = productionRecommendationRepository
                .findByProduct_IdProductAndCompany_IdCompany(productId, companyId)
                .orElse(null);

        ProductionRecommendation tempRecommendation = recommendation != null ? recommendation : new ProductionRecommendation();
        if (tempRecommendation.getIdProductionRecommendation() == null) {
            tempRecommendation.setProduct(product);
            tempRecommendation.setCompany(product.getCompany());
            tempRecommendation.setStatus("PENDING");
        }

        updateRecommendationValues(tempRecommendation, companyId);

        if (tempRecommendation.getRecommendedQuantity() == null 
                || tempRecommendation.getRecommendedQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            if (tempRecommendation.getIdProductionRecommendation() != null) {
                productionRecommendationRepository.delete(tempRecommendation);
            }
            return;
        }

        productionRecommendationRepository.save(tempRecommendation);
    }

    private void updateRecommendationValues(ProductionRecommendation recommendation, Integer companyId) {
        if (recommendation.getProduct() == null) {
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(30);

        List<Consumption> consumptions = consumptionRepository
                .findByProductIdProductAndProduct_Company_IdCompanyAndConsumptionDateBetween(
                        recommendation.getProduct().getIdProduct(),
                        companyId,
                        startDate,
                        today);

        BigDecimal currentStock = recommendation.getProduct().getCurrentStock() != null
                ? recommendation.getProduct().getCurrentStock()
                : BigDecimal.ZERO;

        BigDecimal dailyConsumption = BigDecimal.ZERO;
        BigDecimal totalConsumption = BigDecimal.ZERO;

        for (Consumption consumption : consumptions) {
            if (consumption.getQuantity() == null || consumption.getConsumptionDate() == null) {
                continue;
            }
            totalConsumption = totalConsumption.add(consumption.getQuantity());
        }

        long totalPeriodDays = ChronoUnit.DAYS.between(startDate, today) + 1;
        if (totalConsumption.compareTo(BigDecimal.ZERO) > 0 && totalPeriodDays > 0) {
            dailyConsumption = totalConsumption.divide(
                    BigDecimal.valueOf(totalPeriodDays), 5, RoundingMode.HALF_UP);
        }

        BigDecimal safetyStock = dailyConsumption.multiply(SAFETY_DAYS);
        BigDecimal targetStock = safetyStock.add(dailyConsumption.multiply(TARGET_COVERAGE_DAYS));
        BigDecimal recommendedQuantity = targetStock.subtract(currentStock);

        if (recommendedQuantity.compareTo(BigDecimal.ZERO) < 0) {
            recommendedQuantity = BigDecimal.ZERO;
        }

        String unit = recommendation.getProduct().getUnit();
        if ("UNIT".equalsIgnoreCase(unit) || "BOX".equalsIgnoreCase(unit) || "SET".equalsIgnoreCase(unit)) {
            recommendedQuantity = recommendedQuantity.setScale(0, RoundingMode.CEILING);
        }

        LocalDate stockoutDate = null;
        if (dailyConsumption.compareTo(BigDecimal.ZERO) > 0 && currentStock.compareTo(BigDecimal.ZERO) > 0) {
            long daysUntilStockout = currentStock.divide(dailyConsumption, 0, RoundingMode.CEILING).longValue();
            stockoutDate = today.plusDays(daysUntilStockout);
        } else if (currentStock.compareTo(BigDecimal.ZERO) <= 0) {
            stockoutDate = today;
        }

        BigDecimal confidenceScore = consumptions.size() >= 10 ? new BigDecimal("90.00")
                : consumptions.size() >= 5 ? new BigDecimal("80.00")
                : consumptions.size() >= 3 ? new BigDecimal("70.00")
                : new BigDecimal("50.00");

        String reason;
        if (currentStock.compareTo(BigDecimal.ZERO) <= 0) {
            reason = "Stock de produit fini épuisé, besoin de lancer une production.";
        } else if (currentStock.compareTo(safetyStock) <= 0) {
            reason = "Le stock est inférieur ou égal au stock de sécurité.";
        } else {
            reason = "Le niveau de stock est stable.";
        }

        recommendation.setCurrentStock(currentStock);
        recommendation.setEstimatedDailyConsumption(dailyConsumption);
        recommendation.setSafetyStock(safetyStock);
        recommendation.setRecommendedQuantity(recommendedQuantity);
        recommendation.setEstimatedStockoutDate(stockoutDate);
        recommendation.setConfidenceScore(confidenceScore);
        recommendation.setReason(reason);
    }

    @Transactional
    public void delete(Integer id) {
        Integer companyId = getCurrentCompanyId();

        ProductionRecommendation recommendation = productionRecommendationRepository
                .findByIdProductionRecommendationAndCompany_IdCompany(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Production recommendation not found with id: " + id));

        productionRecommendationRepository.delete(recommendation);
    }

    private Integer getCurrentCompanyId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) {
            throw new IllegalStateException("Authenticated company not found.");
        }

        return principal.companyId();
    }
}