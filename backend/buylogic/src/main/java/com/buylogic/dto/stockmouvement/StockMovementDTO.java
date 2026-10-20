package com.buylogic.dto.stockmouvement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockMovementDTO {

    public StockMovementDTO(Integer idStockMovement, Integer idProduct, String movementType, BigDecimal quantity, LocalDateTime movementDate, String reference, LocalDateTime createdAt) {
        this.idStockMovement = idStockMovement;
        this.idProduct = idProduct;
        this.movementType = movementType;
        this.quantity = quantity;
        this.movementDate = movementDate;
        this.reference = reference;
        this.createdAt = createdAt;
    }

    private Integer idStockMovement;
    private Integer idProduct;
    private String movementType;
    private BigDecimal quantity;
    private LocalDateTime movementDate;
    private String reference;
    private LocalDateTime createdAt;
}
