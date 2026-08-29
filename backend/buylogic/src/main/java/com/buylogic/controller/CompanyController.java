package com.buylogic.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.buylogic.dto.company.CompanyCreateDTO;
import com.buylogic.dto.company.CompanyDTO;
import com.buylogic.dto.company.CompanyUpdateDTO;
import com.buylogic.service.CompanyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@Validated
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<CompanyDTO>> getAll() {
        return ResponseEntity.ok(companyService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                companyService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CompanyDTO> create(
            @Valid @RequestBody CompanyCreateDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(companyService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody CompanyUpdateDTO dto) {

        return ResponseEntity.ok(
                companyService.update(id, dto));
    }

    @PostMapping("/{id}/logo")
    public ResponseEntity<CompanyDTO> uploadLogo(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                companyService.updateLogo(id, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id) {

        companyService.delete(id);

        return ResponseEntity.noContent().build();
    }
}