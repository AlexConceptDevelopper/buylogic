package com.buylogic.dto.supplier;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SupplierUpdateDTO {

    public SupplierUpdateDTO(String name, String email, String phone, String address, Boolean active) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.active = active;
    }

    @NotBlank
    private String name;

    @Email
    private String email;

    private String phone;

    private String address;

    @NotNull
    private Boolean active;
}