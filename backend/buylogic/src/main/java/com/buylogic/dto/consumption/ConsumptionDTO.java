package com.buylogic.dto.consumption;

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
public class ConsumptionDTO {

    private Integer idConsumption;
    private Integer idProduct;
    private BigDecimal quantity;
    private LocalDate consumptionDate;
    private String source;
    private LocalDateTime createdAt;
}