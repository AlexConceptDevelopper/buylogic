package com.buylogic.dto.purchaseorder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderDTO {

    private Integer idPurchaseOrder;
    private Integer idCompany;
    private Integer idSupplier;

    private String supplierName;

    private String orderNumber;
    private String status;

    private LocalDateTime orderedAt;
    private LocalDate expectedDeliveryDate;
    private LocalDateTime receivedAt;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;
}