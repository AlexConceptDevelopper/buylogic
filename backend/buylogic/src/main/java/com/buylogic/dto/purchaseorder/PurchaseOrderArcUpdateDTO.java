package com.buylogic.dto.purchaseorder;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderArcUpdateDTO {
    private String arcNumber;
    private LocalDate expectedDeliveryDate;
}
