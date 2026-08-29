package com.buylogic.dto.company;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyCreateDTO {

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