package com.buylogic.dto.product;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateDTO {

    @NotNull
    private Integer idCompany;

    private String reference;

    @NotBlank
    private String name;

    private String description;

    @Pattern(
        regexp = "UNIT|KG|L",
        message = "Unit must be UNIT, KG or L."
    )
    private String unit;
    private Boolean fractional;

    @PositiveOrZero
    private BigDecimal currentStock;

    @NotNull
    private Boolean active;
}