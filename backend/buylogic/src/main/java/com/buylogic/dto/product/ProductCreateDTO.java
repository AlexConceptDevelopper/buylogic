package com.buylogic.dto.product;

import java.math.BigDecimal;
import java.util.List;

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
public class ProductCreateDTO {

    @NotNull
    private Integer idCompany;

    private String reference;

    @NotBlank
    private String name;

    private String description;

    @Pattern(regexp = "UNIT|BOX|SET|KG|L|G|ML", message = "Unit must be UNIT, BOX, SET, KG, L, G or ML.")
    private String unit;
    private Boolean fractional;

    @PositiveOrZero
    private BigDecimal currentStock;

    @NotNull
    @Pattern(regexp = "PURCHASED|MANUFACTURED", message = "Type must be PURCHASED or MANUFACTURED.")
    private String type;

    private List<ProductCompositionDTO> components;
}