package com.buylogic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buylogic.dto.company.CompanyConfigurationDTO;
import com.buylogic.service.CompanyConfigurationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/company-configuration")
@RequiredArgsConstructor
public class CompanyConfigurationController {

    private final CompanyConfigurationService companyConfigurationService;

    @GetMapping
    public ResponseEntity<CompanyConfigurationDTO> getCurrent() {
        System.out.println(">>> REQUETE RECUE SUR /company-configuration");
        return ResponseEntity.ok(
                companyConfigurationService.getCurrent()
        );
    }
}