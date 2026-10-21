package com.buylogic.dto.purchaseorderitem;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrderItemCreate {
    
    public PurchaseOrderItemCreate(Integer idPurchaseOrder, Integer idProduct, BigDecimal quantityOrdered, BigDecimal quantityReceived, BigDecimal unitPrice) {
        this.idPurchaseOrder = idPurchaseOrder;
        this.idProduct = idProduct;
        this.quantityOrdered = quantityOrdered;
        this.quantityReceived = quantityReceived;
        this.unitPrice = unitPrice;
    }

    private Integer idPurchaseOrder;
    private Integer idProduct;
    private BigDecimal quantityOrdered;
    private BigDecimal quantityReceived;
    private BigDecimal unitPrice;
}