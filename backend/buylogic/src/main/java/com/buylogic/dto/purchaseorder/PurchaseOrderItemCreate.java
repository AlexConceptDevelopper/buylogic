package com.buylogic.dto.purchaseorder;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItemCreate {

    private Integer idPurchaseOrder;
    private Integer idProduct;
    private BigDecimal quantityOrdered;
    private BigDecimal quantityReceived;
    private BigDecimal unitPrice;
}