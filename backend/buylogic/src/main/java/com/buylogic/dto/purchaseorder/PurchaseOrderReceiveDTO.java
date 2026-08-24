package com.buylogic.dto.purchaseorder;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderReceiveDTO {
    private List<PurchaseOrderItemReceiveDTO> items;
}
