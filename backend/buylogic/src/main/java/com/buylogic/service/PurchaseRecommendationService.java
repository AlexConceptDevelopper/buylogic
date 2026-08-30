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
import com.buylogic.model.Consumption;
import com.buylogic.model.Product;
import com.buylogic.model.PurchaseRecommendation;
import com.buylogic.model.SupplierProduct;
import com.buylogic.model.enums.ProductType;
import com.buylogic.repository.global.ConsumptionRepository;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.PurchaseRecommendationRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseRecommendationService {

    private final ProductRepository productRepository;
    private final PurchaseRecommendationRepository purchaseRecommendationRepository;
    private final ConsumptionRepository consumptionRepository;
    private final PurchaseRecommendationMapper purchaseRecommendationMapper;

    private static final BigDecimal SAFETY_DAYS = new BigDecimal("2");
    private static final BigDecimal TARGET_COVERAGE_DAYS = new BigDecimal("7");

    public List<PurchaseRecommendationDTO> getAll() {
        Integer companyId = getCurrentCompanyId();

        return purchaseRecommendationRepository.findAllByCompany_IdCompany(companyId)
                .stream()
                .map(recommendation -> {
                    updateRecommendationValues(recommendation, companyId);
                    return purchaseRecommendationMapper.toDTO(recommendation);
                })
                .toList();
    }

    public PurchaseRecommendationDTO getById(Integer id) {
        Integer companyId = getCurrentCompanyId();

        PurchaseRecommendation recommendation = purchaseRecommendationRepository
                .findByIdRecommendationAndCompany_IdCompany(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Purchase recommendation not found with id: " + id));

        updateRecommendationValues(recommendation, companyId);
        return purchaseRecommendationMapper.toDTO(recommendation);
    }

    /**
     * Génère, met à jour ou supprime la recommandation lors d'un mouvement de
     * stock.
     * Réservé exclusivement aux produits de type PURCHASED.
     */
    @Transactional
    public void generateOrUpdateForProduct(Integer productId, Integer companyId) {
        Product product = productRepository.findByIdProductAndCompany_IdCompany(productId, companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + productId));

        // SÉCURITÉ : Si ce n'est pas un produit PURCHASED, on supprime l'éventuelle
        // reco d'achat et on stoppe
        if (product.getType() != ProductType.PURCHASED) {
            purchaseRecommendationRepository.findByProduct_IdProductAndCompany_IdCompany(productId, companyId)
                    .ifPresent(purchaseRecommendationRepository::delete);
            return;
        }

        PurchaseRecommendation recommendation = purchaseRecommendationRepository
                .findByProduct_IdProductAndCompany_IdCompany(productId, companyId)
                .orElse(null);

        PurchaseRecommendation tempRecommendation = recommendation != null ? recommendation
                : new PurchaseRecommendation();
        if (tempRecommendation.getIdRecommendation() == null) {
            tempRecommendation.setProduct(product);
            tempRecommendation.setCompany(product.getCompany());
            tempRecommendation.setStatus("PENDING");

            if (product.getSupplierProducts() != null) {
                product.getSupplierProducts().stream()
                        .filter(sp -> sp != null && Boolean.TRUE.equals(sp.getActive()) && sp.getSupplier() != null
                                && sp.getUnitPrice() != null)
                        .sorted((sp1, sp2) -> sp1.getUnitPrice().compareTo(sp2.getUnitPrice()))
                        .findFirst()
                        .ifPresent(sp -> tempRecommendation.setSupplier(sp.getSupplier()));
            }
        }

        // On met à jour les valeurs calculées dans tempRecommendation
        updateRecommendationValues(tempRecommendation, companyId);

        // --- NETTOYAGE AUTOMATIQUE ---
        // Si la quantité recommandée est nulle ou négative (stock suffisant)
        if (tempRecommendation.getRecommendedQuantity() == null
                || tempRecommendation.getRecommendedQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            // Si elle existait déjà en base, on la supprime définitivement
            if (tempRecommendation.getIdRecommendation() != null) {
                purchaseRecommendationRepository.delete(tempRecommendation);
            }
            return; // On stoppe là, rien à sauvegarder
        }
        // -----------------------------

        // Sinon, on sauvegarde la recommandation mise à jour
        purchaseRecommendationRepository.save(tempRecommendation);
    }

    private void updateRecommendationValues(PurchaseRecommendation recommendation, Integer companyId) {
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
        LocalDate firstConsumptionDate = null;
        LocalDate lastConsumptionDate = null;
        BigDecimal totalConsumption = BigDecimal.ZERO;

        for (Consumption consumption : consumptions) {
            if (consumption.getQuantity() == null || consumption.getConsumptionDate() == null) {
                continue;
            }
            totalConsumption = totalConsumption.add(consumption.getQuantity());

            if (firstConsumptionDate == null || consumption.getConsumptionDate().isBefore(firstConsumptionDate)) {
                firstConsumptionDate = consumption.getConsumptionDate();
            }
            if (lastConsumptionDate == null || consumption.getConsumptionDate().isAfter(lastConsumptionDate)) {
                lastConsumptionDate = consumption.getConsumptionDate();
            }
        }

        long totalPeriodDays = ChronoUnit.DAYS.between(startDate, today) + 1;
        if (totalConsumption.compareTo(BigDecimal.ZERO) > 0 && totalPeriodDays > 0) {
            dailyConsumption = totalConsumption.divide(
                    BigDecimal.valueOf(totalPeriodDays), 5, RoundingMode.HALF_UP);
        }

        SupplierProduct supplierProduct = null;
        if (recommendation.getProduct().getSupplierProducts() != null) {
            List<SupplierProduct> activeSuppliers = new java.util.ArrayList<>();
            for (SupplierProduct item : recommendation.getProduct().getSupplierProducts()) {
                if (item != null
                        && Boolean.TRUE.equals(item.getActive())
                        && item.getSupplier() != null
                        && item.getUnitPrice() != null
                        && item.getExpectedLeadTimeDays() != null) {
                    activeSuppliers.add(item);
                }
            }

            if (!activeSuppliers.isEmpty()) {
                BigDecimal minPrice = activeSuppliers.get(0).getUnitPrice();
                BigDecimal maxPrice = minPrice;
                int minDelay = activeSuppliers.get(0).getExpectedLeadTimeDays();
                int maxDelay = minDelay;

                for (SupplierProduct sp : activeSuppliers) {
                    if (sp.getUnitPrice().compareTo(minPrice) < 0)
                        minPrice = sp.getUnitPrice();
                    if (sp.getUnitPrice().compareTo(maxPrice) > 0)
                        maxPrice = sp.getUnitPrice();
                    if (sp.getExpectedLeadTimeDays() < minDelay)
                        minDelay = sp.getExpectedLeadTimeDays();
                    if (sp.getExpectedLeadTimeDays() > maxDelay)
                        maxDelay = sp.getExpectedLeadTimeDays();
                }

                // Poids (ex: 70% prix, 30% délai)
                double weightPrice = 0.7;
                double weightDelay = 0.3;

                SupplierProduct bestSupplier = activeSuppliers.get(0);
                double bestScore = Double.MAX_VALUE;

                for (SupplierProduct sp : activeSuppliers) {
                    double score = calculateScore(sp, minPrice, maxPrice, minDelay, maxDelay, weightPrice, weightDelay);
                    if (score < bestScore) {
                        bestScore = score;
                        bestSupplier = sp;
                    }
                }

                supplierProduct = bestSupplier;
                if (supplierProduct != null) {
                    recommendation.setSupplier(supplierProduct.getSupplier());
                }
            }
        }

        BigDecimal leadTimeDays = supplierProduct != null && supplierProduct.getExpectedLeadTimeDays() != null
                ? BigDecimal.valueOf(supplierProduct.getExpectedLeadTimeDays())
                : recommendation.getEstimatedLeadTimeDays() != null
                        ? recommendation.getEstimatedLeadTimeDays()
                        : BigDecimal.ZERO;

        BigDecimal safetyStock = dailyConsumption.multiply(SAFETY_DAYS);
        BigDecimal reorderPoint = dailyConsumption.multiply(leadTimeDays).add(safetyStock);

        BigDecimal targetStock = reorderPoint.add(dailyConsumption.multiply(TARGET_COVERAGE_DAYS));
        BigDecimal recommendedQuantity = targetStock.subtract(currentStock);

        if (recommendedQuantity.compareTo(BigDecimal.ZERO) < 0) {
            recommendedQuantity = BigDecimal.ZERO;
        }

        if (supplierProduct != null) {
            // 1. Respect du Minimum de Commande (MOQ)
            BigDecimal minimumOrderQuantity = supplierProduct.getMinimumOrderQuantity();
            if (minimumOrderQuantity != null && minimumOrderQuantity.compareTo(BigDecimal.ZERO) > 0
                    && recommendedQuantity.compareTo(minimumOrderQuantity) < 0) {
                recommendedQuantity = minimumOrderQuantity;
            }

            // 2. Respect du Conditionnement et du caractère Fractionnable
            BigDecimal packagingQty = supplierProduct.getPackagingQuantity();
            Boolean isFractionable = supplierProduct.getFractionable();

            if (packagingQty != null && packagingQty.compareTo(BigDecimal.ZERO) > 0) {
                if (Boolean.FALSE.equals(isFractionable)) {
                    BigDecimal[] divideAndRemainder = recommendedQuantity.divideAndRemainder(packagingQty);
                    if (divideAndRemainder[1].compareTo(BigDecimal.ZERO) > 0) {
                        recommendedQuantity = divideAndRemainder[0].add(BigDecimal.ONE).multiply(packagingQty);
                    }
                }
            }
        }

        String unit = recommendation.getProduct().getUnit();
        if (unit != null && ("UNIT".equalsIgnoreCase(unit) ||
                "BOX".equalsIgnoreCase(unit) ||
                "SET".equalsIgnoreCase(unit) ||
                "KG".equalsIgnoreCase(unit) ||
                "L".equalsIgnoreCase(unit) ||
                "G".equalsIgnoreCase(unit) ||
                "ML".equalsIgnoreCase(unit))) {

            recommendedQuantity = recommendedQuantity.setScale(0, RoundingMode.CEILING);
        }

        BigDecimal estimatedPurchaseAmount = BigDecimal.ZERO;
        if (supplierProduct != null && supplierProduct.getUnitPrice() != null) {
            estimatedPurchaseAmount = recommendedQuantity.multiply(supplierProduct.getUnitPrice());
        } else if (recommendation.getEstimatedPurchaseAmount() != null
                && recommendation.getRecommendedQuantity() != null
                && recommendation.getRecommendedQuantity().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal estimatedUnitPrice = recommendation.getEstimatedPurchaseAmount()
                    .divide(recommendation.getRecommendedQuantity(), 5, RoundingMode.HALF_UP);
            estimatedPurchaseAmount = recommendedQuantity.multiply(estimatedUnitPrice);
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
            reason = "Stock épuisé et consommation détectée.";
        } else if (currentStock.compareTo(reorderPoint) <= 0) {
            reason = "Le stock est inférieur ou égal au point de commande.";
        } else {
            reason = "Le niveau de stock reste supérieur au point de commande.";
        }

        recommendation.setCurrentStock(currentStock);
        recommendation.setEstimatedDailyConsumption(dailyConsumption);
        recommendation.setEstimatedLeadTimeDays(leadTimeDays);
        recommendation.setSafetyStock(safetyStock);
        recommendation.setReorderPoint(reorderPoint);
        recommendation.setRecommendedQuantity(recommendedQuantity);
        recommendation.setEstimatedPurchaseAmount(estimatedPurchaseAmount);
        recommendation.setEstimatedStockoutDate(stockoutDate);
        recommendation.setConfidenceScore(confidenceScore);
        recommendation.setReason(reason);
    }

    @Transactional
    public void delete(Integer id) {
        Integer companyId = getCurrentCompanyId();

        PurchaseRecommendation recommendation = purchaseRecommendationRepository
                .findByIdRecommendationAndCompany_IdCompany(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Purchase recommendation not found with id: " + id));

        purchaseRecommendationRepository.delete(recommendation);
    }

    private Integer getCurrentCompanyId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) {
            throw new IllegalStateException("Authenticated company not found.");
        }

        return principal.companyId();
    }

    private double calculateScore(SupplierProduct sp, BigDecimal minPrice, BigDecimal maxPrice, int minDelay,
            int maxDelay, double wPrice, double wDelay) {
        // Normalisation du prix (entre 0 et 1)
        double priceRatio = 0.0;
        if (maxPrice.compareTo(minPrice) > 0) {
            priceRatio = sp.getUnitPrice().subtract(minPrice)
                    .divide(maxPrice.subtract(minPrice), 4, RoundingMode.HALF_UP).doubleValue();
        }

        // Normalisation du délai (entre 0 et 1)
        double delayRatio = 0.0;
        if (maxDelay > minDelay) {
            delayRatio = (double) (sp.getExpectedLeadTimeDays() - minDelay) / (maxDelay - minDelay);
        }

        // Score final combiné
        return (priceRatio * wPrice) + (delayRatio * wDelay);
    }
}