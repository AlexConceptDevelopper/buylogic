package com.buylogic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.PurchaseRecommendationDTO;
import com.buylogic.service.PurchaseRecommendationService;

@RestController
@RequestMapping("/recommendations")
public class PurchaseRecommendationController {

    private final PurchaseRecommendationService purchaseRecommendationService;

    public PurchaseRecommendationController(PurchaseRecommendationService purchaseRecommendationService) {
        this.purchaseRecommendationService = purchaseRecommendationService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseRecommendationDTO>> getAll() {
        return ResponseEntity.ok(
                purchaseRecommendationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseRecommendationDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                purchaseRecommendationService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        purchaseRecommendationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/calculate/{companyId}/{productId}")
    public ResponseEntity<PurchaseRecommendationDTO> calculateForProduct(
            @PathVariable Integer companyId,
            @PathVariable Integer productId) {

        purchaseRecommendationService.generateOrUpdateForProduct(productId, companyId);
        return ResponseEntity.ok().build();
    }
}