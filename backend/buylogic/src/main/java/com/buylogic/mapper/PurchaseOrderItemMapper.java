package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.PurchaseOrderItemDTO;
import com.buylogic.model.PurchaseOrderItem;

@Component
public class PurchaseOrderItemMapper {

    public PurchaseOrderItemDTO toDTO(PurchaseOrderItem item) {
        if (item == null) {
            return null;
        }

        PurchaseOrderItemDTO dto = new PurchaseOrderItemDTO();

        dto.setIdPurchaseOrderItem(
                item.getIdPurchaseOrderItem());

        dto.setIdPurchaseOrder(
                item.getPurchaseOrder() != null
                        ? item.getPurchaseOrder().getIdPurchaseOrder()
                        : null);

        if (item.getProduct() != null) {
            dto.setIdProduct(
                    item.getProduct().getIdProduct());

            dto.setProductReference(
                    item.getProduct().getReference());

            dto.setProductName(
                    item.getProduct().getName());
        }

        dto.setQuantityOrdered(
                item.getQuantityOrdered());

        dto.setQuantityReceived(
                item.getQuantityReceived());

        dto.setUnitPrice(
                item.getUnitPrice());

        dto.setCreatedAt(
                item.getCreatedAt());

        return dto;
    }
}