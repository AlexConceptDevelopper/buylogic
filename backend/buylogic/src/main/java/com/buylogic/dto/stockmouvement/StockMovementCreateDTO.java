package com.buylogic.dto.stockmouvement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementCreateDTO {

    @NotNull
    private Integer idProduct;

    @NotBlank
    private String movementType;

    @NotNull
    private BigDecimal quantity;

    private LocalDateTime movementDate;

    private String reference;
}