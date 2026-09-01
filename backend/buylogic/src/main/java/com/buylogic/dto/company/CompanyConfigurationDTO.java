package com.buylogic.dto.company;

import com.buylogic.model.enums.ProductManagementMode;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyConfigurationDTO {

    private Integer idCompanyConfiguration;
    private Integer idCompany;
    private ProductManagementMode productManagementMode;
}