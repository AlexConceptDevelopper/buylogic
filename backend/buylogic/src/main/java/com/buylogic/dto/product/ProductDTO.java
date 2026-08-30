package com.buylogic.dto.product;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

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