package com.buylogic.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.consumption.ConsumptionCreateDTO;
import com.buylogic.dto.consumption.ConsumptionDTO;
import com.buylogic.dto.consumption.ConsumptionImportDTO;
import com.buylogic.service.ConsumptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/consumptions")
@RequiredArgsConstructor
@Validated
public class ConsumptionController {

    private final ConsumptionService consumptionService;

    @GetMapping
    public ResponseEntity<List<ConsumptionDTO>> getAll() {
        return ResponseEntity.ok(
                consumptionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsumptionDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                consumptionService.getById(id));
    }

    @GetMapping("/product/{idProduct}")
    public ResponseEntity<List<ConsumptionDTO>> getByProductAndPeriod(
            @PathVariable Integer idProduct,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(
                consumptionService.getByProductAndPeriod(
                        idProduct,
                        startDate,
                        endDate));
    }

    @PostMapping
    public ResponseEntity<ConsumptionDTO> create(
            @Valid @RequestBody ConsumptionCreateDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        consumptionService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id) {

        consumptionService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<Integer> importBatch(
            @Valid @RequestBody ConsumptionImportDTO dto) {
        return ResponseEntity.ok(
                consumptionService.importBatch(dto));
    }
}