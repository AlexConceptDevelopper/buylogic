package com.buylogic.dto.superadmin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminDTO {
    private Integer idSuperAdmin;
    private String email;
    private String firstName;
    private String lastName;
    private Boolean active;
}
