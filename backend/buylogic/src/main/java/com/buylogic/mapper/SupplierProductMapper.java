package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.supplierproduct.SupplierProductCreateDTO;
import com.buylogic.dto.supplierproduct.SupplierProductDTO;
import com.buylogic.dto.supplierproduct.SupplierProductUpdateDTO;
import com.buylogic.model.Product;
import com.buylogic.model.Supplier;
import com.buylogic.model.SupplierProduct;

@Component
public class SupplierProductMapper {

    public SupplierProductDTO toDTO(
            SupplierProduct supplierProduct) {

        if (supplierProduct == null) {
            return null;
        }

        SupplierProductDTO dto = new SupplierProductDTO();

        dto.setIdSupplierProduct(
            supplierProduct.getIdSupplierProduct()
        );

        dto.setIdProduct(
            supplierProduct.getProduct() != null
                ? supplierProduct.getProduct().getIdProduct()
                : null
        );

        dto.setIdSupplier(
            supplierProduct.getSupplier() != null
                ? supplierProduct.getSupplier().getIdSupplier()
                : null
        );

        dto.setSupplierReference(
            supplierProduct.getSupplierReference()
        );

        dto.setUnitPrice(
            supplierProduct.getUnitPrice()
        );

        dto.setMinimumOrderQuantity(
            supplierProduct.getMinimumOrderQuantity()
        );

        dto.setExpectedLeadTimeDays(
            supplierProduct.getExpectedLeadTimeDays()
        );

        dto.setActive(
            supplierProduct.getActive()
        );

        return dto;
    }

    public SupplierProduct toEntity(
            SupplierProductCreateDTO dto,
            Product product,
            Supplier supplier) {

        if (dto == null) {
            return null;
        }

        SupplierProduct supplierProduct =
            new SupplierProduct();

        supplierProduct.setProduct(product);
        supplierProduct.setSupplier(supplier);
        supplierProduct.setSupplierReference(
            dto.getSupplierReference()
        );
        supplierProduct.setUnitPrice(
            dto.getUnitPrice()
        );
        supplierProduct.setMinimumOrderQuantity(
            dto.getMinimumOrderQuantity()
        );
        supplierProduct.setExpectedLeadTimeDays(
            dto.getExpectedLeadTimeDays()
        );
        supplierProduct.setActive(true);

        return supplierProduct;
    }

    public void updateEntity(
            SupplierProduct supplierProduct,
            SupplierProductUpdateDTO dto,
            Product product,
            Supplier supplier) {

        supplierProduct.setProduct(product);
        supplierProduct.setSupplier(supplier);
        supplierProduct.setSupplierReference(
            dto.getSupplierReference()
        );
        supplierProduct.setUnitPrice(
            dto.getUnitPrice()
        );
        supplierProduct.setMinimumOrderQuantity(
            dto.getMinimumOrderQuantity()
        );
        supplierProduct.setExpectedLeadTimeDays(
            dto.getExpectedLeadTimeDays()
        );
        supplierProduct.setActive(
            dto.getActive()
        );
    }
}