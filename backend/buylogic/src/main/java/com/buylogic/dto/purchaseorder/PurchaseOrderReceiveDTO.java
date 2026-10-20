package com.buylogic.dto.purchaseorder;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class PurchaseOrderReceiveDTO {
    
    public PurchaseOrderReceiveDTO(List<PurchaseOrderItemReceiveDTO> items) {
        this.items = items;
    }
    
    private List<PurchaseOrderItemReceiveDTO> items;
}
