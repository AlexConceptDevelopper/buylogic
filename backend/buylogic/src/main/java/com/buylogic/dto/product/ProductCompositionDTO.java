package com.buylogic.dto.product;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCompositionDTO {

    @NotNull(message = "Child product ID is mandatory.")
    private Integer idChildProduct;

    @NotNull(message = "Quantity is mandatory.")
    @Positive(message = "Quantity must be greater than zero.")
    private BigDecimal quantity;
}