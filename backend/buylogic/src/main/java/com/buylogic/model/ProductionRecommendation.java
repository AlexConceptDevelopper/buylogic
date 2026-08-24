package com.buylogic.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "production_recommendation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductionRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProductionRecommendation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_company", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_product", nullable = false)
    private Product product; // Doit être un produit de type MANUFACTURED

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, VALIDATED, CANCELLED, etc.

    @Column(name = "recommended_quantity", precision = 14, scale = 3)
    private BigDecimal recommendedQuantity;

    @Column(name = "current_stock", precision = 14, scale = 3)
    private BigDecimal currentStock;

    @Column(name = "safety_stock", precision = 14, scale = 3)
    private BigDecimal safetyStock;

    @Column(name = "estimated_daily_consumption", precision = 14, scale = 5)
    private BigDecimal estimatedDailyConsumption;

    @Column(name = "estimated_stockout_date")
    private LocalDate estimatedStockoutDate;

    @Column(name = "confidence_score", precision = 5, scale = 2)
    private BigDecimal confidenceScore;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}