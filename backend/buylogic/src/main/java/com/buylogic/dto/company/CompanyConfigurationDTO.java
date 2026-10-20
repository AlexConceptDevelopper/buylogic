package com.buylogic.dto.company;

import com.buylogic.model.enums.ProductManagementMode;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompanyConfigurationDTO {

    public CompanyConfigurationDTO(Integer idCompanyConfiguration, Integer idCompany, ProductManagementMode productManagementMode) {
        this.idCompanyConfiguration = idCompanyConfiguration;
        this.idCompany = idCompany;
        this.productManagementMode = productManagementMode;
    }

    private Integer idCompanyConfiguration;
    private Integer idCompany;
    private ProductManagementMode productManagementMode;
}