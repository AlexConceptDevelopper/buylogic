package com.buylogic.dto.supplier;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SupplierDTO {

    public SupplierDTO(Integer idSupplier, Integer idCompany, String name, String email, String phone, String address, Boolean active) {
        this.idSupplier = idSupplier;
        this.idCompany = idCompany;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.active = active;
    }

    private Integer idSupplier;
    private Integer idCompany;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Boolean active;
}
