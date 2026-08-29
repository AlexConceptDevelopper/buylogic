package com.buylogic.dto.appuser;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppUserUpdateDTO {

    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must be less than 50 characters")
    private String lastName;

    @Size(max = 100, message = "Department must be less than 100 characters")
    private String department;

    private String role;

    private Boolean active;
}