package com.buylogic.dto.purchaseorder;

import java.time.LocalDate;
import java.util.List;

import com.buylogic.dto.purchaseorderitem.PurchaseOrderItemCreate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrderCreate {

    public PurchaseOrderCreate(Integer idSupplier, String orderNumber, LocalDate expectedDeliveryDate, List<PurchaseOrderItemCreate> items) {
        this.idSupplier = idSupplier;
        this.orderNumber = orderNumber;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.items = items;
    }
    
    private Integer idSupplier;
    private String orderNumber;
    private LocalDate expectedDeliveryDate;
    private List<PurchaseOrderItemCreate> items;
}