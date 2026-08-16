package com.buylogic.dto.stockmouvement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementDTO {

    private Integer idStockMovement;
    private Integer idProduct;
    private String movementType;
    private BigDecimal quantity;
    private LocalDateTime movementDate;
    private String reference;
    private LocalDateTime createdAt;
}
