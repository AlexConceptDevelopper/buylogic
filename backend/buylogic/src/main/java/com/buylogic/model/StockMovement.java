package com.buylogic.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stock_movement")
@Getter
@Setter
@NoArgsConstructor
public class StockMovement {

    public StockMovement(Integer idStockMovement, Product product, String movementType, BigDecimal quantity, LocalDateTime movementDate, String reference, LocalDateTime createdAt) {
        this.idStockMovement = idStockMovement;
        this.product = product;
        this.movementType = movementType;
        this.quantity = quantity;
        this.movementDate = movementDate;
        this.reference = reference;
        this.createdAt = createdAt;
    }   

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idStockMovement;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;

    @Column(name = "movement_type", nullable = false, length = 30)
    private String movementType;

    @Column(nullable = false, precision = 14, scale = 3)
    private BigDecimal quantity;

    @Column(name = "movement_date", nullable = false)
    private LocalDateTime movementDate;

    @Column(length = 100)
    private String reference;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (movementDate == null) {
            movementDate = LocalDateTime.now();
        }

        createdAt = LocalDateTime.now();
    }
}
