package com.buylogic.dto.superadmin;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SuperAdminLoginDTO {

    public SuperAdminLoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    private String email;
    private String password;
}