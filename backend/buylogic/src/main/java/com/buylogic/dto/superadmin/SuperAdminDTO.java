package com.buylogic.dto.superadmin;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SuperAdminDTO {

    public SuperAdminDTO(Integer idSuperAdmin, String email, String firstName, String lastName, Boolean active) {
        this.idSuperAdmin = idSuperAdmin;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.active = active;
    }

    private Integer idSuperAdmin;
    private String email;
    private String firstName;
    private String lastName;
    private Boolean active;
}
