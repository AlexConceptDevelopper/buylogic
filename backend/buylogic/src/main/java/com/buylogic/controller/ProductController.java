package com.buylogic.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.product.ProductCompositionDTO;
import com.buylogic.dto.product.ProductCreateDTO;
import com.buylogic.dto.product.ProductDTO;
import com.buylogic.dto.product.ProductUpdateDTO;
import com.buylogic.dto.stockmouvement.StockAdjustmentDTO;
import com.buylogic.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Validated
public class ProductController {

        private final ProductService productService;

        @GetMapping
        public ResponseEntity<List<ProductDTO>> getAll() {
                return ResponseEntity.ok(productService.getAll());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ProductDTO> getById(
                        @PathVariable Integer id) {

                return ResponseEntity.ok(
                                productService.getById(id));
        }

        @PostMapping
        public ResponseEntity<ProductDTO> create(
                        @Valid @RequestBody ProductCreateDTO dto) {

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(productService.create(dto));
        }

        @PutMapping("/{id}")
        public ResponseEntity<ProductDTO> update(
                        @PathVariable Integer id,
                        @Valid @RequestBody ProductUpdateDTO dto) {

                return ResponseEntity.ok(
                                productService.update(id, dto));
        }

        @PatchMapping("/{id}/adjust-stock")
        public ResponseEntity<ProductDTO> adjustStock(
                        @PathVariable Integer id,
                        @RequestBody @Valid StockAdjustmentDTO dto) {
                return ResponseEntity.ok(productService.adjustStock(id, dto));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(
                        @PathVariable Integer id) {

                productService.delete(id);

                return ResponseEntity.noContent().build();
        }

        // Créer une recette avec des produits
        @PostMapping("/{id}/components")
        public ResponseEntity<ProductDTO> addComponent(
                        @PathVariable Integer id,
                        @Valid @RequestBody ProductCompositionDTO dto) {

                return ResponseEntity.ok(
                                productService.addComponent(id, dto));
        }

        // lance la production d'un produit composé
        @PostMapping("/{id}/produce")
        public ResponseEntity<ProductDTO> produce(
                        @PathVariable Integer id,
                        @RequestParam BigDecimal quantityToProduce) {

                return ResponseEntity.ok(
                                productService.produceProduct(id, quantityToProduce));
        }

        // delete un ingredient d'un produit composé
        @DeleteMapping("/{id}/components/{childId}")
        public ResponseEntity<ProductDTO> removeComponent(
                        @PathVariable Integer id,
                        @PathVariable Integer childId) {

                return ResponseEntity.ok(
                                productService.removeComponent(id, childId));
        }
}