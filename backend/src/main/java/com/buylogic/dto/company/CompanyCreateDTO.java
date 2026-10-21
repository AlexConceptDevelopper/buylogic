package com.buylogic.dto.company;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompanyCreateDTO {

    public CompanyCreateDTO(String name, String email, String phone, String siret, String address, String receptionHours, String logoUrl) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.siret = siret;
        this.address = address;
        this.receptionHours = receptionHours;
        this.logoUrl = logoUrl;
    }

    @NotBlank
    private String name;

    @Email
    private String email;

    private String phone;
    private String siret;
    private String address;
    private String receptionHours;
    private String logoUrl;
}