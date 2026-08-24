package com.buylogic.dto.purchaseorderitem;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItemDTO {


    private Integer idPurchaseOrderItem;
    private Integer idPurchaseOrder;
    private Integer idProduct;

    private String productReference;
    private String productName;

    private BigDecimal quantityOrdered;
    private BigDecimal quantityReceived;
    private BigDecimal unitPrice;

    private LocalDateTime createdAt;
}