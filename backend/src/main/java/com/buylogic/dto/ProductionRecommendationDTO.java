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
public class ProductionRecommendationDTO {

    public ProductionRecommendationDTO(Integer idProductionRecommendation, Integer idCompany, Integer idProduct, String productReference, String productName, String status, BigDecimal recommendedQuantity, BigDecimal currentStock, BigDecimal safetyStock, BigDecimal estimatedDailyConsumption, LocalDate estimatedStockoutDate, BigDecimal confidenceScore, String reason, LocalDateTime createdAt, LocalDateTime resolvedAt) {
        this.idProductionRecommendation = idProductionRecommendation;
        this.idCompany = idCompany;
        this.idProduct = idProduct;
        this.productReference = productReference;
        this.productName = productName;
        this.status = status;
        this.recommendedQuantity = recommendedQuantity;
        this.currentStock = currentStock;
        this.safetyStock = safetyStock;
        this.estimatedDailyConsumption = estimatedDailyConsumption;
        this.estimatedStockoutDate = estimatedStockoutDate;
        this.confidenceScore = confidenceScore;
        this.reason = reason;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
    }

    private Integer idProductionRecommendation;
    private Integer idCompany;
    private Integer idProduct;

    private String productReference;
    private String productName;

    private String status;

    private BigDecimal recommendedQuantity;
    private BigDecimal currentStock;
    private BigDecimal safetyStock;
    private BigDecimal estimatedDailyConsumption;

    private LocalDate estimatedStockoutDate;
    private BigDecimal confidenceScore;
    private String reason;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}