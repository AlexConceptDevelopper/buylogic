package com.buylogic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminLoginDTO {
    private String email;
    private String password;
}