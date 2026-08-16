package com.buylogic.dto.supplierproduct;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierProductDTO {

    private Integer idSupplierProduct;
    private Integer idProduct;
    private Integer idSupplier;
    private String supplierReference;
    private BigDecimal unitPrice;
    private BigDecimal minimumOrderQuantity;
    private Integer expectedLeadTimeDays;
    private Boolean active;
}
