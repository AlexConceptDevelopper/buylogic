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
public class PurchaseOrderItemReceiveDTO {
    private Integer idPurchaseOrderItem;
    private BigDecimal quantityReceivedNow; 
    private BigDecimal unitPrice;           
}