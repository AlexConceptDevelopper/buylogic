package com.buylogic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buylogic.dto.company.CompanyConfigurationDTO;
import com.buylogic.service.CompanyConfigurationService;


@RestController
@RequestMapping("/company-configuration")
public class CompanyConfigurationController {

    private final CompanyConfigurationService companyConfigurationService;

    public CompanyConfigurationController(CompanyConfigurationService companyConfigurationService) {
        this.companyConfigurationService = companyConfigurationService;
    }

    @GetMapping
    public ResponseEntity<CompanyConfigurationDTO> getCurrent() {
        return ResponseEntity.ok(
                companyConfigurationService.getCurrent());
    }
}