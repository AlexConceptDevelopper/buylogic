package com.buylogic.dto.supplierproduct;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SupplierProductDTO {

    public SupplierProductDTO(Integer idSupplierProduct, Integer idProduct, Integer idSupplier, String supplierReference, BigDecimal unitPrice, BigDecimal minimumOrderQuantity, Integer expectedLeadTimeDays, BigDecimal packagingQuantity, String packagingUnit, Boolean fractionable, Boolean active) {
        this.idSupplierProduct = idSupplierProduct;
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

    private Integer idSupplierProduct;
    private Integer idProduct;
    private Integer idSupplier;
    private String supplierReference;
    private BigDecimal unitPrice;
    private BigDecimal minimumOrderQuantity;
    private Integer expectedLeadTimeDays;
    private BigDecimal packagingQuantity;
    private String packagingUnit;
    private Boolean fractionable;
    private Boolean active;
}