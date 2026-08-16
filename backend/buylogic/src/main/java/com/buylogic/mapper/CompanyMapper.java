package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.company.CompanyCreateDTO;
import com.buylogic.dto.company.CompanyDTO;
import com.buylogic.dto.company.CompanyUpdateDTO;
import com.buylogic.model.Company;

@Component
public class CompanyMapper {

    public CompanyDTO toDTO(Company company) {
        if (company == null) {
            return null;
        }

        CompanyDTO dto = new CompanyDTO();

        dto.setIdCompany(company.getIdCompany());
        dto.setName(company.getName());
        dto.setEmail(company.getEmail());
        dto.setActive(company.getActive());

        return dto;
    }

    public Company toEntity(CompanyCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Company company = new Company();

        company.setName(dto.getName());
        company.setEmail(dto.getEmail());
        company.setActive(true);

        return company;
    }

    public void updateEntity(
            Company company,
            CompanyUpdateDTO dto) {

        company.setName(dto.getName());
        company.setEmail(dto.getEmail());
        company.setActive(dto.getActive());
    }
}