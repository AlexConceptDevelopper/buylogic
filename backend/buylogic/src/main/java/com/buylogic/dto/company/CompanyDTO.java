package com.buylogic.dto.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDTO {

    private Integer idCompany;
    private String name;
    private String email;
    private String phone;
    private Boolean active;
    private String siret;
    private String address;
    private String receptionHours;
    private String logoUrl;
}