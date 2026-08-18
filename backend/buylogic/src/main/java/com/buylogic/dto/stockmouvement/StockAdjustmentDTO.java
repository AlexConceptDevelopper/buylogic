package com.buylogic.dto.stockmouvement;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockAdjustmentDTO {

    @NotNull
    @PositiveOrZero
    private BigDecimal targetStock;

    @NotBlank
    private String reason;
}