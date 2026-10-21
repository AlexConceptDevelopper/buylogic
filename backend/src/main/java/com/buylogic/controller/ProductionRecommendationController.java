package com.buylogic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.ProductionRecommendationDTO;
import com.buylogic.service.ProductionRecommendationService;


@RestController
@RequestMapping("/production-recommendations")
public class ProductionRecommendationController {

    private final ProductionRecommendationService productionRecommendationService;

    public ProductionRecommendationController(ProductionRecommendationService productionRecommendationService) {
        this.productionRecommendationService = productionRecommendationService;
    }

    @GetMapping
    public ResponseEntity<List<ProductionRecommendationDTO>> getAll() {
        return ResponseEntity.ok(
                productionRecommendationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductionRecommendationDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                productionRecommendationService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        productionRecommendationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/calculate/{companyId}/{productId}")
    public ResponseEntity<Void> calculateForProduct(
            @PathVariable Integer companyId,
            @PathVariable Integer productId) {

        productionRecommendationService.generateOrUpdateForProduct(productId, companyId);
        return ResponseEntity.ok().build();
    }
}