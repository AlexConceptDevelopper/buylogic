package com.buylogic.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.buylogic.dto.product.ProductCreateDTO;
import com.buylogic.dto.product.ProductDTO;
import com.buylogic.dto.product.ProductCompositionDTO;
import com.buylogic.dto.product.ProductUpdateDTO;
import com.buylogic.model.Company;
import com.buylogic.model.Product;
import com.buylogic.model.enums.ProductType;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();

        dto.setIdProduct(product.getIdProduct());
        dto.setIdCompany(
                product.getCompany() != null
                        ? product.getCompany().getIdCompany()
                        : null);

        dto.setReference(product.getReference());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setUnit(product.getUnit());
        dto.setFractional(product.getFractional());
        dto.setCurrentStock(product.getCurrentStock());
        dto.setActive(product.getActive());

        // Mapping du type vers le DTO (String)
        dto.setType(product.getType() != null ? product.getType().name() : ProductType.PURCHASED.name());

        // Mapping de la liste des composants (recette)
        if (product.getComponents() != null) {
            dto.setComponents(
                    product.getComponents().stream().map(comp -> {
                        ProductCompositionDTO compDto = new ProductCompositionDTO();
                        compDto.setIdChildProduct(comp.getChildProduct().getIdProduct());
                        compDto.setQuantity(comp.getQuantity());
                        return compDto;
                    }).collect(Collectors.toList()));
        } else {
            dto.setComponents(new java.util.ArrayList<>());
        }

        return dto;
    }

    public Product toEntity(
            ProductCreateDTO dto,
            Company company) {

        if (dto == null) {
            return null;
        }

        Product product = new Product();

        product.setCompany(company);
        product.setReference(dto.getReference());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setUnit(
                dto.getUnit() != null && !dto.getUnit().isBlank()
                        ? dto.getUnit()
                        : "UNIT");
        product.setFractional(
                dto.getFractional() != null
                        ? dto.getFractional()
                        : true);
        product.setCurrentStock(
                dto.getCurrentStock() != null
                        ? dto.getCurrentStock()
                        : java.math.BigDecimal.ZERO);
        product.setActive(true);

        // Mapping du type depuis le DTO (String vers Enum)
        product.setType(
                dto.getType() != null && !dto.getType().isBlank()
                        ? ProductType.valueOf(dto.getType())
                        : ProductType.PURCHASED);

        return product;
    }

    public void updateEntity(
            Product product,
            ProductUpdateDTO dto,
            Company company) {

        product.setCompany(company);
        product.setReference(dto.getReference());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setUnit(
                dto.getUnit() != null && !dto.getUnit().isBlank()
                        ? dto.getUnit()
                        : "UNIT");
        product.setFractional(
                dto.getFractional() != null
                        ? dto.getFractional()
                        : true);
        product.setCurrentStock(
                dto.getCurrentStock() != null
                        ? dto.getCurrentStock()
                        : java.math.BigDecimal.ZERO);
        product.setActive(dto.getActive());

        // Mise à jour du type
        product.setType(
                dto.getType() != null && !dto.getType().isBlank()
                        ? ProductType.valueOf(dto.getType())
                        : ProductType.PURCHASED);
    }
}