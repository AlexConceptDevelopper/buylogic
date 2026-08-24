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
public class ProductionRecommendationDTO {

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