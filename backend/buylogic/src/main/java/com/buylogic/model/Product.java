package com.buylogic.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.buylogic.model.enums.ProductType;

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

    /**
     * Unit used internally by BuyLogic for stock and consumption.
     *
     * Supported values:
     * UNIT - individual pieces
     * KG - kilograms
     * L - litres
     */
    @Column(nullable = false, length = 20)
    private String unit = "UNIT";

    @Column(nullable = false)
    private Boolean fractional = true;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductType type = ProductType.PURCHASED;

    // Ingrédients qui composent ce produit (si c'est un produit MANUFACTURED)
    @OneToMany(mappedBy = "parentProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductComposition> components;

    // Produits dans lesquels ce produit est utilisé comme composant (optionnel mais
    // pratique)
    @OneToMany(mappedBy = "childProduct")
    private List<ProductComposition> usedInProducts;

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