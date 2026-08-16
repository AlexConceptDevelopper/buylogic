package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.purchaseorder.PurchaseOrderDTO;
import com.buylogic.model.PurchaseOrder;

@Component
public class PurchaseOrderMapper {

    public PurchaseOrderDTO toDTO(PurchaseOrder order) {

        if (order == null) {
            return null;
        }

        PurchaseOrderDTO dto = new PurchaseOrderDTO();

        dto.setIdPurchaseOrder(
                order.getIdPurchaseOrder());

        dto.setIdCompany(
                order.getCompany() != null
                        ? order.getCompany().getIdCompany()
                        : null);

        dto.setIdSupplier(
                order.getSupplier() != null
                        ? order.getSupplier().getIdSupplier()
                        : null);

        dto.setSupplierName(
                order.getSupplier() != null
                        ? order.getSupplier().getName()
                        : null);

        dto.setOrderNumber(
                order.getOrderNumber());

        dto.setStatus(
                order.getStatus());

        dto.setOrderedAt(
                order.getOrderedAt());

        dto.setExpectedDeliveryDate(
                order.getExpectedDeliveryDate());

        dto.setReceivedAt(
                order.getReceivedAt());

        dto.setTotalAmount(
                order.getTotalAmount());

        dto.setCreatedAt(
                order.getCreatedAt());

        return dto;
    }
}