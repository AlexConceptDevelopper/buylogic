package com.buylogic.dto.consumption;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConsumptionDTO {

    public ConsumptionDTO(Integer idConsumption, Integer idProduct, BigDecimal quantity, LocalDate consumptionDate, String source, LocalDateTime createdAt) {
        this.idConsumption = idConsumption;
        this.idProduct = idProduct;
        this.quantity = quantity;
        this.consumptionDate = consumptionDate;
        this.source = source;
        this.createdAt = createdAt;
    }

    private Integer idConsumption;
    private Integer idProduct;
    private BigDecimal quantity;
    private LocalDate consumptionDate;
    private String source;
    private LocalDateTime createdAt;
}