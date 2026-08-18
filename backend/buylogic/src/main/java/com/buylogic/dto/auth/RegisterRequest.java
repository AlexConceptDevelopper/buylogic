package com.buylogic.dto.auth;

import com.buylogic.model.enums.ConsumptionMode;
import com.buylogic.model.enums.ConsumptionSource;
import com.buylogic.model.enums.ProductManagementMode;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank
        @Size(max = 100)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Email
        @Size(max = 255)
        String email,

        @NotBlank
        @Size(min = 8, max = 100)
        String password,

        @NotBlank
        @Size(max = 150)
        String companyName,

        @NotNull
        ProductManagementMode productManagementMode,

        @NotNull
        ConsumptionMode consumptionMode,

        @NotNull
        ConsumptionSource consumptionSource

) {
}