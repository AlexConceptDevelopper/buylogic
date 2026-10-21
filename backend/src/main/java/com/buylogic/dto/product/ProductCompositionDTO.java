package com.buylogic.dto.product;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductCompositionDTO {

    public ProductCompositionDTO(Integer idChildProduct, BigDecimal quantity) {
        this.idChildProduct = idChildProduct;
        this.quantity = quantity;
    }

    @NotNull(message = "Child product ID is mandatory.")
    private Integer idChildProduct;

    @NotNull(message = "Quantity is mandatory.")
    @Positive(message = "Quantity must be greater than zero.")
    private BigDecimal quantity;
}