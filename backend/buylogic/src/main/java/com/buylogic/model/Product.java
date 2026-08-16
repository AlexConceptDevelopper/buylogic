package com.buylogic.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProduct;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_company", nullable = false)
    private Company company;

    @Column(length = 100)
    private String reference;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 30)
    private String unit = "UNIT";

    @Column(name = "current_stock", nullable = false, precision = 14, scale = 3)
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product")
    private List<SupplierProduct> supplierProducts;

    @OneToMany(mappedBy = "product")
    private List<StockMovement> stockMovements;

    @OneToMany(mappedBy = "product")
    private List<Consumption> consumptions;

    @OneToMany(mappedBy = "product")
    private List<PurchaseOrderItem> purchaseOrderItems;

    @OneToMany(mappedBy = "product")
    private List<PurchaseRecommendation> purchaseRecommendations;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}