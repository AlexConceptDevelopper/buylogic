package com.buylogic.dto.purchaseorderitem;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrderItemDTO {

    public PurchaseOrderItemDTO(Integer idPurchaseOrderItem, Integer idPurchaseOrder, Integer idProduct, String productReference, String productName, BigDecimal quantityOrdered, BigDecimal quantityReceived, BigDecimal unitPrice, LocalDateTime createdAt) {
        this.idPurchaseOrderItem = idPurchaseOrderItem;
        this.idPurchaseOrder = idPurchaseOrder;
        this.idProduct = idProduct;
        this.productReference = productReference;
        this.productName = productName;
        this.quantityOrdered = quantityOrdered;
        this.quantityReceived = quantityReceived;
        this.unitPrice = unitPrice;
        this.createdAt = createdAt;
    }

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