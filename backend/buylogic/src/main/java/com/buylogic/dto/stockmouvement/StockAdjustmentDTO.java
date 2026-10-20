package com.buylogic.dto.stockmouvement;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockAdjustmentDTO {

    public StockAdjustmentDTO(Integer idProduct, BigDecimal targetStock, String reason) {
        this.targetStock = targetStock;
        this.reason = reason;
    }

    @NotNull
    @PositiveOrZero
    private BigDecimal targetStock;

    @NotBlank
    private String reason;
}