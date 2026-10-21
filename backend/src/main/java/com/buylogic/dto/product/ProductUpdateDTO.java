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
public class ProductUpdateDTO {

    public ProductUpdateDTO(Integer idCompany, String reference, String name, String description, String unit, Boolean fractional, BigDecimal currentStock, Boolean active, String type, List<ProductCompositionDTO> components) {
        this.idCompany = idCompany;
        this.reference = reference;
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.fractional = fractional;
        this.currentStock = currentStock;
        this.active = active;
        this.type = type;
        this.components = components;
    }

    @NotNull
    private Integer idCompany;

    private String reference;

    @NotBlank
    private String name;

    private String description;

    @Pattern(regexp = "UNIT|BOX|SET|KG|L|G|MTR", message = "Unit must be UNIT, BOX, SET, KG, L, G or MTR.")
    private String unit;
    
    private Boolean fractional;

    @PositiveOrZero
    private BigDecimal currentStock;

    @NotNull
    private Boolean active;

    @NotNull
    @Pattern(regexp = "PURCHASED|MANUFACTURED", message = "Type must be PURCHASED or MANUFACTURED.")
    private String type;

    private List<ProductCompositionDTO> components;

    // Failsafe manuel si Lombok coince sur ce champ dans l'IDE
    public Boolean getFractional() {
        return fractional;
    }

    public void setFractional(Boolean fractional) {
        this.fractional = fractional;
    }
}