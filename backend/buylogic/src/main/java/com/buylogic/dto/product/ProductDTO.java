package com.buylogic.dto.product;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductDTO {

    public ProductDTO(Integer idProduct, Integer idCompany, String reference, String name, String description, String unit, Boolean fractional, BigDecimal currentStock, Boolean active, String type, List<ProductCompositionDTO> components) {
        this.idProduct = idProduct;
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

    private Integer idProduct;
    private Integer idCompany;
    private String reference;
    private String name;
    private String description;
    private String unit;
    private Boolean fractional;
    private BigDecimal currentStock;
    private Boolean active;
    private String type; 
    private List<ProductCompositionDTO> components;
}