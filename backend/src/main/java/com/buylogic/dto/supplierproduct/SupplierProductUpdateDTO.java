package com.buylogic.dto.supplierproduct;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SupplierProductUpdateDTO {

    public SupplierProductUpdateDTO(Integer idProduct, Integer idSupplier, String supplierReference, BigDecimal unitPrice, BigDecimal minimumOrderQuantity, Integer expectedLeadTimeDays, BigDecimal packagingQuantity, String packagingUnit, Boolean fractionable, Boolean active) {
        this.idProduct = idProduct;
        this.idSupplier = idSupplier;
        this.supplierReference = supplierReference;
        this.unitPrice = unitPrice;
        this.minimumOrderQuantity = minimumOrderQuantity;
        this.expectedLeadTimeDays = expectedLeadTimeDays;
        this.packagingQuantity = packagingQuantity;
        this.packagingUnit = packagingUnit;
        this.fractionable = fractionable;
        this.active = active;
    }

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