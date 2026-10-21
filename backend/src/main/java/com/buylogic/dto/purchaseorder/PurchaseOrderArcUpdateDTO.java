package com.buylogic.dto.purchaseorder;

import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrderArcUpdateDTO {

    public PurchaseOrderArcUpdateDTO(String arcNumber, LocalDate expectedDeliveryDate) {
        this.arcNumber = arcNumber;
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    private String arcNumber;
    private LocalDate expectedDeliveryDate;
}
