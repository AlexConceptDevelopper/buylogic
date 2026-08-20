package com.buylogic.dto.supplierproduct;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierProductUpdateDTO {

    @NotNull
    private Integer idProduct;

    @NotNull
    private Integer idSupplier;

    private String supplierReference;

    @PositiveOrZero
    private BigDecimal unitPrice;

    @Positive
    private BigDecimal minimumOrderQuantity;

    @PositiveOrZero
    private Integer expectedLeadTimeDays;

    @Positive
    private BigDecimal packagingQuantity;
    @Pattern(regexp = "UNIT|KG|L|BOX|SET|G|ML", message = "Packaging unit must be UNIT, KG, L, BOX, SET, G or ML.")
    private String packagingUnit;

    @NotNull
    private Boolean fractionable;

    @NotNull
    private Boolean active;
}