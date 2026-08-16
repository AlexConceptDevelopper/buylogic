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

import com.buylogic.dto.PurchaseRecommendationDTO;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.PurchaseRecommendationMapper;
import com.buylogic.model.PurchaseRecommendation;
import com.buylogic.model.SupplierProduct;
import com.buylogic.model.Consumption;
import com.buylogic.repository.global.PurchaseRecommendationRepository;
import com.buylogic.repository.global.ConsumptionRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseRecommendationService {

        private static final BigDecimal SAFETY_DAYS = new BigDecimal("2");

        private static final BigDecimal TARGET_COVERAGE_DAYS = new BigDecimal("7");

        private final PurchaseRecommendationRepository purchaseRecommendationRepository;
        private final ConsumptionRepository consumptionRepository;
        private final PurchaseRecommendationMapper purchaseRecommendationMapper;

        public List<PurchaseRecommendationDTO> getAll() {
                Integer companyId = getCurrentCompanyId();

                return purchaseRecommendationRepository
                                .findAllByCompany_IdCompany(companyId)
                                .stream()
                                .map(recommendation -> recalculateRecommendation(
                                                recommendation,
                                                companyId))
                                .toList();
        }

        public PurchaseRecommendationDTO getById(Integer id) {
                Integer companyId = getCurrentCompanyId();

                PurchaseRecommendation recommendation = purchaseRecommendationRepository
                                .findByIdRecommendationAndCompany_IdCompany(
                                                id,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase recommendation not found with id: "
                                                                + id));

                return recalculateRecommendation(
                                recommendation,
                                companyId);
        }

        @Transactional
        public void delete(Integer id) {
                Integer companyId = getCurrentCompanyId();

                PurchaseRecommendation recommendation = purchaseRecommendationRepository
                                .findByIdRecommendationAndCompany_IdCompany(
                                                id,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase recommendation not found with id: "
                                                                + id));

                purchaseRecommendationRepository.delete(
                                recommendation);
        }

        private PurchaseRecommendationDTO recalculateRecommendation(
                        PurchaseRecommendation recommendation,
                        Integer companyId) {
                if (recommendation.getProduct() == null) {
                        return purchaseRecommendationMapper.toDTO(
                                        recommendation);
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

                LocalDate firstConsumptionDate = null;
                LocalDate lastConsumptionDate = null;

                BigDecimal totalConsumption = BigDecimal.ZERO;

                for (Consumption consumption : consumptions) {
                        if (consumption.getQuantity() == null
                                        || consumption.getConsumptionDate() == null) {
                                continue;
                        }

                        totalConsumption = totalConsumption.add(
                                        consumption.getQuantity());

                        if (firstConsumptionDate == null
                                        || consumption.getConsumptionDate()
                                                        .isBefore(firstConsumptionDate)) {
                                firstConsumptionDate = consumption.getConsumptionDate();
                        }

                        if (lastConsumptionDate == null
                                        || consumption.getConsumptionDate()
                                                        .isAfter(lastConsumptionDate)) {
                                lastConsumptionDate = consumption.getConsumptionDate();
                        }
                }

                if (firstConsumptionDate != null
                                && lastConsumptionDate != null) {

                        long observedDays = ChronoUnit.DAYS.between(
                                        firstConsumptionDate,
                                        lastConsumptionDate) + 1;

                        if (observedDays > 0) {
                                dailyConsumption = totalConsumption.divide(
                                                BigDecimal.valueOf(observedDays),
                                                5,
                                                RoundingMode.HALF_UP);
                        }
                }

                SupplierProduct supplierProduct = null;

                if (recommendation.getSupplier() != null
                                && recommendation.getProduct()
                                                .getSupplierProducts() != null) {

                        supplierProduct = recommendation.getProduct()
                                        .getSupplierProducts()
                                        .stream()
                                        .filter(item -> item.getSupplier() != null
                                                        && item.getSupplier()
                                                                        .getIdSupplier()
                                                                        .equals(
                                                                                        recommendation
                                                                                                        .getSupplier()
                                                                                                        .getIdSupplier())
                                                        && Boolean.TRUE.equals(
                                                                        item.getActive()))
                                        .findFirst()
                                        .orElse(null);
                }

                BigDecimal leadTimeDays = supplierProduct != null
                                && supplierProduct
                                                .getExpectedLeadTimeDays() != null
                                                                ? BigDecimal.valueOf(
                                                                                supplierProduct
                                                                                                .getExpectedLeadTimeDays())
                                                                : recommendation.getEstimatedLeadTimeDays() != null
                                                                                ? recommendation
                                                                                                .getEstimatedLeadTimeDays()
                                                                                : BigDecimal.ZERO;

                BigDecimal safetyStock = dailyConsumption.multiply(
                                SAFETY_DAYS);

                BigDecimal reorderPoint = dailyConsumption
                                .multiply(leadTimeDays)
                                .add(safetyStock);

                BigDecimal targetStock = reorderPoint.add(
                                dailyConsumption.multiply(
                                                TARGET_COVERAGE_DAYS));
                BigDecimal recommendedQuantity = targetStock.subtract(currentStock);

                if (recommendedQuantity.compareTo(
                                BigDecimal.ZERO) < 0) {

                        recommendedQuantity = BigDecimal.ZERO;
                }

                if (supplierProduct != null) {

                        BigDecimal minimumOrderQuantity = supplierProduct.getMinimumOrderQuantity();

                        if (minimumOrderQuantity != null
                                        && minimumOrderQuantity.compareTo(
                                                        BigDecimal.ZERO) > 0
                                        && recommendedQuantity.compareTo(
                                                        minimumOrderQuantity) < 0) {

                                recommendedQuantity = minimumOrderQuantity;
                        }
                }

                String unit = recommendation
                                .getProduct()
                                .getUnit();

                if ("UNIT".equalsIgnoreCase(unit)
                                || "BOX".equalsIgnoreCase(unit)
                                || "SET".equalsIgnoreCase(unit)) {

                        recommendedQuantity = recommendedQuantity.setScale(
                                        0,
                                        RoundingMode.CEILING);
                }

                BigDecimal estimatedPurchaseAmount = BigDecimal.ZERO;

                if (supplierProduct != null
                                && supplierProduct.getUnitPrice() != null) {

                        estimatedPurchaseAmount = recommendedQuantity.multiply(
                                        supplierProduct.getUnitPrice());
                } else if (recommendation.getEstimatedPurchaseAmount() != null
                                && recommendation.getRecommendedQuantity() != null
                                && recommendation.getRecommendedQuantity()
                                                .compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal estimatedUnitPrice = recommendation
                                        .getEstimatedPurchaseAmount()
                                        .divide(
                                                        recommendation
                                                                        .getRecommendedQuantity(),
                                                        5,
                                                        RoundingMode.HALF_UP);

                        estimatedPurchaseAmount = recommendedQuantity.multiply(
                                        estimatedUnitPrice);
                }

                LocalDate stockoutDate = null;

                if (dailyConsumption.compareTo(BigDecimal.ZERO) > 0
                                && currentStock.compareTo(BigDecimal.ZERO) > 0) {

                        long daysUntilStockout = currentStock
                                        .divide(
                                                        dailyConsumption,
                                                        0,
                                                        RoundingMode.CEILING)
                                        .longValue();

                        stockoutDate = today.plusDays(daysUntilStockout);
                } else if (currentStock.compareTo(BigDecimal.ZERO) <= 0) {
                        stockoutDate = today;
                }

                BigDecimal confidenceScore = consumptions.size() >= 10
                                ? new BigDecimal("90.00")
                                : consumptions.size() >= 5
                                                ? new BigDecimal("80.00")
                                                : consumptions.size() >= 3
                                                                ? new BigDecimal("70.00")
                                                                : new BigDecimal("50.00");

                String reason;

                if (currentStock.compareTo(
                                BigDecimal.ZERO) <= 0) {

                        reason = "Stock épuisé et consommation détectée.";

                } else if (currentStock.compareTo(reorderPoint) <= 0) {

                        reason = "Le stock est inférieur ou égal au point de commande.";

                } else {

                        reason = "Le niveau de stock reste supérieur au point de commande.";
                }

                recommendation.setCurrentStock(
                                currentStock);

                recommendation.setEstimatedDailyConsumption(
                                dailyConsumption);

                recommendation.setEstimatedLeadTimeDays(
                                leadTimeDays);

                recommendation.setSafetyStock(
                                safetyStock);

                recommendation.setReorderPoint(
                                reorderPoint);

                recommendation.setRecommendedQuantity(
                                recommendedQuantity);

                recommendation.setEstimatedPurchaseAmount(
                                estimatedPurchaseAmount);

                recommendation.setEstimatedStockoutDate(
                                stockoutDate);

                recommendation.setConfidenceScore(
                                confidenceScore);

                recommendation.setReason(
                                reason);

                return purchaseRecommendationMapper.toDTO(
                                recommendation);
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