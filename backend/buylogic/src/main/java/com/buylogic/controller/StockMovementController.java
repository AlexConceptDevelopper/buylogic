package com.buylogic.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.stockmouvement.StockAdjustmentDTO;
import com.buylogic.dto.stockmouvement.StockMovementCreateDTO;
import com.buylogic.dto.stockmouvement.StockMovementDTO;
import com.buylogic.service.StockMovementService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/stock-movements")
@RequiredArgsConstructor
@Validated
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @GetMapping
    public ResponseEntity<List<StockMovementDTO>> getAll() {
        return ResponseEntity.ok(
                stockMovementService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockMovementDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                stockMovementService.getById(id));
    }

    @PostMapping
    public ResponseEntity<StockMovementDTO> create(
            @Valid @RequestBody StockMovementCreateDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        stockMovementService.create(dto));
    }

    @PostMapping("/{idProduct}/adjust")
    public ResponseEntity<StockMovementDTO> adjustStock(@PathVariable Integer idProduct,
            @Valid @RequestBody StockAdjustmentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockMovementService.adjustStock(idProduct, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id) {

        stockMovementService.delete(id);

        return ResponseEntity.noContent().build();
    }

    //endpoint de check, verifie si le produit à déjà été initialisé
    @GetMapping("/product/{idProduct}/has-initial")
    public ResponseEntity<Boolean> hasInitialStock(@PathVariable Integer idProduct) {
        return ResponseEntity.ok(stockMovementService.hasInitialStock(idProduct));
    }
}