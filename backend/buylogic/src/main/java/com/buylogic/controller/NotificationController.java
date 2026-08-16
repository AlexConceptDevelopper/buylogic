package com.buylogic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.NotificationDTO;
import com.buylogic.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAll() {
        return ResponseEntity.ok(
            notificationService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
            notificationService.getById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        notificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}