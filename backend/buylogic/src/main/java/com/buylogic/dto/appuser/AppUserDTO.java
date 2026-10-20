package com.buylogic.dto.appuser;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppUserDTO {

    public AppUserDTO() {}

    public AppUserDTO(Integer idUser, Integer idCompany, String companyName, String email, String firstName, String lastName, String department, String role, Boolean active) {
        this.idUser = idUser;
        this.idCompany = idCompany;
        this.companyName = companyName;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.role = role;
        this.active = active;
    }

    private Integer idUser;
    private Integer idCompany;
    private String companyName;
    private String email;
    private String firstName;
    private String lastName;
    private String department;
    private String role;
    private Boolean active;
} 