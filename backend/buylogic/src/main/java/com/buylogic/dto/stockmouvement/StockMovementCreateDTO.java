package com.buylogic.dto.stockmouvement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockMovementCreateDTO {

    public StockMovementCreateDTO(Integer idProduct, String movementType, BigDecimal quantity, LocalDateTime movementDate, String reference) {
        this.idProduct = idProduct;
        this.movementType = movementType;
        this.quantity = quantity;
        this.movementDate = movementDate;
        this.reference = reference;
    }
    
    @NotNull
    private Integer idProduct;

    @NotBlank
    private String movementType;

    @NotNull
    private BigDecimal quantity;

    private LocalDateTime movementDate;

    private String reference;
}