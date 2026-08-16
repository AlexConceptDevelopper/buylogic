package com.buylogic.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.supplierproduct.SupplierProductCreateDTO;
import com.buylogic.dto.supplierproduct.SupplierProductDTO;
import com.buylogic.dto.supplierproduct.SupplierProductUpdateDTO;
import com.buylogic.service.SupplierProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/supplier-products")
@RequiredArgsConstructor
@Validated
public class SupplierProductController {

    private final SupplierProductService supplierProductService;

    @GetMapping
    public ResponseEntity<List<SupplierProductDTO>> getAll() {
        return ResponseEntity.ok(
            supplierProductService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierProductDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
            supplierProductService.getById(id)
        );
    }

    @PostMapping
    public ResponseEntity<SupplierProductDTO> create(
            @Valid @RequestBody SupplierProductCreateDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    supplierProductService.create(dto)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierProductDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody SupplierProductUpdateDTO dto) {

        return ResponseEntity.ok(
            supplierProductService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id) {

        supplierProductService.delete(id);

        return ResponseEntity.noContent().build();
    }
}