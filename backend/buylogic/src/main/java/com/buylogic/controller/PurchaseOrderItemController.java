package com.buylogic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.PurchaseOrderItemDTO;
import com.buylogic.service.PurchaseOrderItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/purchase-order-items")
@RequiredArgsConstructor
public class PurchaseOrderItemController {

    private final PurchaseOrderItemService purchaseOrderItemService;

    @GetMapping
    public ResponseEntity<List<PurchaseOrderItemDTO>> getAll() {
        return ResponseEntity.ok(
                purchaseOrderItemService.getAll());
    }

    @GetMapping("/purchase-order/{idPurchaseOrder}")
    public ResponseEntity<List<PurchaseOrderItemDTO>> getByPurchaseOrderId(
            @PathVariable Integer idPurchaseOrder) {

        return ResponseEntity.ok(
                purchaseOrderItemService.getByPurchaseOrderId(
                        idPurchaseOrder));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderItemDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                purchaseOrderItemService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id) {

        purchaseOrderItemService.delete(id);

        return ResponseEntity.noContent().build();
    }
}