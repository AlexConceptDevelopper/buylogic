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
        dto.setPhone(company.getPhone());
        dto.setActive(company.getActive());
        dto.setSiret(company.getSiret()); 
        dto.setAddress(company.getAddress()); 
        dto.setReceptionHours(company.getReceptionHours());
        dto.setLogoUrl(company.getLogoUrl()); 
        return dto;
    }

    public Company toEntity(CompanyCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Company company = new Company();

        company.setName(dto.getName());
        company.setEmail(dto.getEmail());
        company.setPhone(dto.getPhone());
        company.setActive(true);
        company.setSiret(dto.getSiret()); 
        company.setAddress(dto.getAddress()); 
        company.setReceptionHours(dto.getReceptionHours()); 
        company.setLogoUrl(dto.getLogoUrl()); 

        return company;
    }

    public void updateEntity(
            Company company,
            CompanyUpdateDTO dto) {

       company.setName(dto.getName());
        company.setEmail(dto.getEmail());
        company.setPhone(dto.getPhone()); 
        company.setSiret(dto.getSiret()); 
        company.setAddress(dto.getAddress()); 
        company.setReceptionHours(dto.getReceptionHours()); 
        company.setLogoUrl(dto.getLogoUrl());
    }
}