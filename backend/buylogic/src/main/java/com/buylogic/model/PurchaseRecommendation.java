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
@Table(name = "purchase_recommendation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRecommendation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_company", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_supplier")
    private Supplier supplier;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(name = "recommended_quantity", precision = 14, scale = 3)
    private BigDecimal recommendedQuantity;

    @Column(name = "current_stock", precision = 14, scale = 3)
    private BigDecimal currentStock;

    @Column(name = "safety_stock", precision = 14, scale = 3)
    private BigDecimal safetyStock;

    @Column(name = "reorder_point", precision = 14, scale = 3)
    private BigDecimal reorderPoint;

    @Column(name = "estimated_daily_consumption", precision = 14, scale = 5)
    private BigDecimal estimatedDailyConsumption;

    @Column(name = "estimated_lead_time_days", precision = 10, scale = 2)
    private BigDecimal estimatedLeadTimeDays;

    @Column(name = "estimated_stockout_date")
    private LocalDate estimatedStockoutDate;

    @Column(name = "estimated_purchase_amount", precision = 14, scale = 2)
    private BigDecimal estimatedPurchaseAmount;

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
