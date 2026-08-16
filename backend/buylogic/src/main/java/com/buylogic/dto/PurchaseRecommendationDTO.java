package com.buylogic.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRecommendationDTO {

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