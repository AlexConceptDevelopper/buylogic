package com.buylogic.dto.consumption;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsumptionCreateDTO {

    @NotNull
    private Integer idProduct;

    @NotNull
    @Positive
    private BigDecimal quantity;

    @NotNull
    private LocalDate consumptionDate;

    private String source;
}