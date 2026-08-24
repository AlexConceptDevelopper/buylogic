package com.buylogic.dto.purchaseorder;

import java.time.LocalDate;
import java.util.List;

import com.buylogic.dto.purchaseorderitem.PurchaseOrderItemCreate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderCreate {
    private Integer idSupplier;
    private String orderNumber;
    private LocalDate expectedDeliveryDate;
    private List<PurchaseOrderItemCreate> items;
}