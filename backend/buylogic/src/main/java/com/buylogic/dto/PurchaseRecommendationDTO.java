package com.buylogic.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PurchaseRecommendationDTO {

    public PurchaseRecommendationDTO(Integer idRecommendation, Integer idCompany, Integer idProduct, Integer idSupplier, String productReference, String productName, String supplierName, String status, BigDecimal recommendedQuantity, BigDecimal currentStock, BigDecimal safetyStock, BigDecimal reorderPoint, BigDecimal estimatedDailyConsumption, BigDecimal estimatedLeadTimeDays, LocalDate estimatedStockoutDate, BigDecimal estimatedPurchaseAmount, BigDecimal confidenceScore, String reason, LocalDateTime createdAt, LocalDateTime resolvedAt) {
        this.idRecommendation = idRecommendation;
        this.idCompany = idCompany;
        this.idProduct = idProduct;
        this.idSupplier = idSupplier;
        this.productReference = productReference;
        this.productName = productName;
        this.supplierName = supplierName;
        this.status = status;
        this.recommendedQuantity = recommendedQuantity;
        this.currentStock = currentStock;
        this.safetyStock = safetyStock;
        this.reorderPoint = reorderPoint;
        this.estimatedDailyConsumption = estimatedDailyConsumption;
        this.estimatedLeadTimeDays = estimatedLeadTimeDays;
        this.estimatedStockoutDate = estimatedStockoutDate;
        this.estimatedPurchaseAmount = estimatedPurchaseAmount;
        this.confidenceScore = confidenceScore;
        this.reason = reason;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
    }

    private Integer idRecommendation;
    private Integer idCompany;
    private Integer idProduct;
    private Integer idSupplier;

    private String productReference;
    private String productName;
    private String supplierName;

    private String status;

    private BigDecimal recommendedQuantity;

    private BigDecimal currentStock;
    private BigDecimal safetyStock;
    private BigDecimal reorderPoint;

    private BigDecimal estimatedDailyConsumption;
    private BigDecimal estimatedLeadTimeDays;

    private LocalDate estimatedStockoutDate;

    private BigDecimal estimatedPurchaseAmount;

    private BigDecimal confidenceScore;

    private String reason;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}