package com.buylogic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.PurchaseRecommendationDTO;
import com.buylogic.service.PurchaseRecommendationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class PurchaseRecommendationController {

    private final PurchaseRecommendationService purchaseRecommendationService;

    @GetMapping
    public ResponseEntity<List<PurchaseRecommendationDTO>> getAll() {
        return ResponseEntity.ok(
            purchaseRecommendationService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseRecommendationDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
            purchaseRecommendationService.getById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        purchaseRecommendationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}