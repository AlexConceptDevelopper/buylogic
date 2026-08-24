package com.buylogic.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.purchaseorder.PurchaseOrderCreate;
import com.buylogic.dto.purchaseorder.PurchaseOrderDTO;
import com.buylogic.dto.purchaseorder.PurchaseOrderReceiveDTO;
import com.buylogic.service.PurchaseOrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ResponseEntity<List<PurchaseOrderDTO>> getAll() {
        return ResponseEntity.ok(
                purchaseOrderService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                purchaseOrderService.getById(id));
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderDTO> create(@RequestBody PurchaseOrderCreate data) {
        return ResponseEntity.ok(purchaseOrderService.create(data));
    }

    // créer une commande d'une recommendations
    @PostMapping("/from-recommendations")
    public ResponseEntity<List<PurchaseOrderDTO>> createFromRecommendations(
            @RequestBody List<Integer> recommendationIds) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(purchaseOrderService.createDraftOrdersFromRecommendations(recommendationIds));
    }

    // met à jour une commande modifié
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> update(
            @PathVariable Integer id,
            @RequestBody PurchaseOrderCreate data) {
        return ResponseEntity.ok(purchaseOrderService.update(id, data));
    }

    // met à jour le status de la commande
    @PatchMapping("/{id}/status")
    public ResponseEntity<PurchaseOrderDTO> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        return ResponseEntity.ok(purchaseOrderService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Integer id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.noContent().build();
    }

    // endpoint de reception de la commande
    @PostMapping("/{id}/receive")
    public ResponseEntity<PurchaseOrderDTO> receiveOrder(
            @PathVariable Integer id,
            @RequestBody PurchaseOrderReceiveDTO receiveData) {
        return ResponseEntity.ok(purchaseOrderService.receiveOrder(id, receiveData));
    }

    // Endpoint pour récupérer une commande avec ses items explicitement
    @GetMapping("/{id}/with-items")
    public ResponseEntity<PurchaseOrderDTO> getOrderWithItems(@PathVariable Integer id) {
        return ResponseEntity.ok(purchaseOrderService.getOrderWithItems(id));
    }
}