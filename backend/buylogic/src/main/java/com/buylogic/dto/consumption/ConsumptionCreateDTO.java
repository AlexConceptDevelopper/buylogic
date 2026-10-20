package com.buylogic.dto.consumption;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConsumptionCreateDTO {

    public ConsumptionCreateDTO(Integer idProduct, BigDecimal quantity, LocalDate consumptionDate, String source, String customerName) {
        this.idProduct = idProduct;
        this.quantity = quantity;
        this.consumptionDate = consumptionDate;
        this.source = source;
        this.customerName = customerName;
    }

    @NotNull
    private Integer idProduct;

    @NotNull
    @Positive
    private BigDecimal quantity;

    @NotNull
    private LocalDate consumptionDate;

    private String source;
    private String customerName;
}