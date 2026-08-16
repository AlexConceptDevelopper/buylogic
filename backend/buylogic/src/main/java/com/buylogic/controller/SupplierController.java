package com.buylogic.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.supplier.SupplierCreateDTO;
import com.buylogic.dto.supplier.SupplierDTO;
import com.buylogic.dto.supplier.SupplierUpdateDTO;
import com.buylogic.service.SupplierService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@Validated
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<SupplierDTO>> getAll() {
        return ResponseEntity.ok(
            supplierService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
            supplierService.getById(id)
        );
    }

    @PostMapping
    public ResponseEntity<SupplierDTO> create(
            @Valid @RequestBody SupplierCreateDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    supplierService.create(dto)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody SupplierUpdateDTO dto) {

        return ResponseEntity.ok(
            supplierService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id) {

        supplierService.delete(id);

        return ResponseEntity.noContent().build();
    }
}