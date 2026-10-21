package com.buylogic.dto.product;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductCreateDTO {

    public ProductCreateDTO(Integer idCompany, String reference, String name, String description, String unit, Boolean fractional, BigDecimal currentStock, String type, List<ProductCompositionDTO> components) {
        this.idCompany = idCompany;
        this.reference = reference;
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.fractional = fractional;
        this.currentStock = currentStock;
        this.type = type;
        this.components = components;
    }

    @NotNull
    private Integer idCompany;

    private String reference;

    @NotBlank
    private String name;

    private String description;

    @Pattern(regexp = "UNIT|BOX|SET|KG|L|G|ML|MTR", message = "Unit must be UNIT, BOX, SET, KG, L, G or MTR.")
    private String unit;
    private Boolean fractional;

    @PositiveOrZero
    private BigDecimal currentStock;

    @NotNull
    @Pattern(regexp = "PURCHASED|MANUFACTURED", message = "Type must be PURCHASED or MANUFACTURED.")
    private String type;

    private List<ProductCompositionDTO> components;
}