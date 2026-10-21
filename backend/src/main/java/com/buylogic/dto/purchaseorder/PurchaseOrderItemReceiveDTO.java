package com.buylogic.dto.purchaseorder;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrderItemReceiveDTO {

    public PurchaseOrderItemReceiveDTO(Integer idPurchaseOrderItem, BigDecimal quantityReceivedNow,
            BigDecimal unitPrice) {
        this.idPurchaseOrderItem = idPurchaseOrderItem;
        this.quantityReceivedNow = quantityReceivedNow;
        this.unitPrice = unitPrice;
    }
    
    private Integer idPurchaseOrderItem;
    private BigDecimal quantityReceivedNow; 
    private BigDecimal unitPrice;           
}