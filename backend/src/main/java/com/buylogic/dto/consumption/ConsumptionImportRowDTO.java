package com.buylogic.dto.consumption;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConsumptionImportRowDTO {

    public ConsumptionImportRowDTO(String reference, BigDecimal quantity, LocalDate consumptionDate, String clientName) {
        this.reference = reference;
        this.quantity = quantity;
        this.consumptionDate = consumptionDate;
        this.clientName = clientName;
    }   

    private String reference;
    private BigDecimal quantity;
    private LocalDate consumptionDate;
    private String clientName;
}