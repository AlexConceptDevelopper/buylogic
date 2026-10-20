package com.buylogic.dto.purchaseorderitem;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrderItemUpdate {

    public PurchaseOrderItemUpdate(BigDecimal quantityOrdered, BigDecimal quantityReceived, BigDecimal unitPrice) {
        this.quantityOrdered = quantityOrdered;
        this.quantityReceived = quantityReceived;
        this.unitPrice = unitPrice;
    }

    private BigDecimal quantityOrdered;
    private BigDecimal quantityReceived;
    private BigDecimal unitPrice;
}