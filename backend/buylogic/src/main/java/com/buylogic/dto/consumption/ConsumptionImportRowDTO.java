package com.buylogic.dto.consumption;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsumptionImportRowDTO {

    private String reference;
    private BigDecimal quantity;
    private LocalDate consumptionDate;
}