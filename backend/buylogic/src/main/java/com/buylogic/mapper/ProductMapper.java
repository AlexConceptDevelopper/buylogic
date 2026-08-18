package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.product.ProductCreateDTO;
import com.buylogic.dto.product.ProductDTO;
import com.buylogic.dto.product.ProductUpdateDTO;
import com.buylogic.model.Company;
import com.buylogic.model.Product;

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
    }
}