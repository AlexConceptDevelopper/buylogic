package com.buylogic.dto.supplier;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDTO {

    private Integer idSupplier;
    private Integer idCompany;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Boolean active;
}
