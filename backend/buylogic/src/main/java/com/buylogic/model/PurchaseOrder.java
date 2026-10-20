package com.buylogic.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.buylogic.model.enums.OrderStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "purchase_order")
@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrder {

    public PurchaseOrder(Integer idPurchaseOrder, Company company, Supplier supplier, String orderNumber, OrderStatus status, LocalDateTime orderedAt, String arcNumber, LocalDate expectedDeliveryDate, LocalDateTime receivedAt, BigDecimal totalAmount, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isAutoRecommended, List<PurchaseOrderItem> items) {
        this.idPurchaseOrder = idPurchaseOrder;
        this.company = company;
        this.supplier = supplier;
        this.orderNumber = orderNumber;
        this.status = status;
        this.orderedAt = orderedAt;
        this.arcNumber = arcNumber;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.receivedAt = receivedAt;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isAutoRecommended = isAutoRecommended;
        this.items = items;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPurchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_company", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_supplier", nullable = false)
    private Supplier supplier;

    @Column(name = "order_number", length = 100)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status = OrderStatus.DRAFT;

    private LocalDateTime orderedAt;

    @Column(name = "arc_number", length = 100)
    private String arcNumber;

    private LocalDate expectedDeliveryDate;

    private LocalDateTime receivedAt;

    @Column(name = "total_amount", precision = 14, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_auto_recommended", nullable = false)
    private Boolean isAutoRecommended = false;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderItem> items;

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
