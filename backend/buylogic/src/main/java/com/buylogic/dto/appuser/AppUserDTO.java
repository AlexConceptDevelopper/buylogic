package com.buylogic.dto.appuser;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppUserDTO {

    private Integer idUser;
    private Integer idCompany;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Boolean active;
}