package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.supplier.SupplierCreateDTO;
import com.buylogic.dto.supplier.SupplierDTO;
import com.buylogic.dto.supplier.SupplierUpdateDTO;
import com.buylogic.model.Company;
import com.buylogic.model.Supplier;

@Component
public class SupplierMapper {

    public SupplierDTO toDTO(Supplier supplier) {
        if (supplier == null) {
            return null;
        }

        SupplierDTO dto = new SupplierDTO();

        dto.setIdSupplier(supplier.getIdSupplier());

        dto.setIdCompany(
            supplier.getCompany() != null
                ? supplier.getCompany().getIdCompany()
                : null
        );

        dto.setName(supplier.getName());
        dto.setEmail(supplier.getEmail());
        dto.setPhone(supplier.getPhone());
        dto.setAddress(supplier.getAddress());
        dto.setActive(supplier.getActive());

        return dto;
    }

    public Supplier toEntity(
            SupplierCreateDTO dto,
            Company company) {

        if (dto == null) {
            return null;
        }

        Supplier supplier = new Supplier();

        supplier.setCompany(company);
        supplier.setName(dto.getName());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setActive(true);

        return supplier;
    }

    public void updateEntity(
            Supplier supplier,
            SupplierUpdateDTO dto,
            Company company) {

        supplier.setCompany(company);
        supplier.setName(dto.getName());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setActive(dto.getActive());
    }
}