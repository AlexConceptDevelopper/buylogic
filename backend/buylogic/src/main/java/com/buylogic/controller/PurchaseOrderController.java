package com.buylogic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.purchaseorder.PurchaseOrderDTO;
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
            purchaseOrderService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
            purchaseOrderService.getById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        purchaseOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}