package com.buylogic.dto.purchaseorder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.buylogic.dto.purchaseorderitem.PurchaseOrderItemDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrderDTO {

    public PurchaseOrderDTO(Integer idPurchaseOrder, Integer idCompany, Integer idSupplier, String supplierName, String orderNumber, String status, LocalDateTime orderedAt, String arcNumber, LocalDate expectedDeliveryDate, LocalDateTime receivedAt, BigDecimal totalAmount, LocalDateTime createdAt, List<PurchaseOrderItemDTO> items) {
        this.idPurchaseOrder = idPurchaseOrder;
        this.idCompany = idCompany;
        this.idSupplier = idSupplier;
        this.supplierName = supplierName;
        this.orderNumber = orderNumber;
        this.status = status;
        this.orderedAt = orderedAt;
        this.arcNumber = arcNumber;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.receivedAt = receivedAt;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
        this.items = items;
    }

    private Integer idPurchaseOrder;
    private Integer idCompany;
    private Integer idSupplier;

    private String supplierName;

    private String orderNumber;
    private String status;

    private LocalDateTime orderedAt;
    private String arcNumber;
    private LocalDate expectedDeliveryDate;
    private LocalDateTime receivedAt;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;
    private List<PurchaseOrderItemDTO> items;
}