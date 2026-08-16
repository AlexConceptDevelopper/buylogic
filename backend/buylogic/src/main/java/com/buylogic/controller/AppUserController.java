package com.buylogic.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.buylogic.dto.appuser.AppUserCreateDTO;
import com.buylogic.dto.appuser.AppUserDTO;
import com.buylogic.service.AppUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;

    @GetMapping
    public ResponseEntity<List<AppUserDTO>> getAll() {
        return ResponseEntity.ok(
            appUserService.getAll()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<AppUserDTO> getMe() {
        return ResponseEntity.ok(
            appUserService.getMe()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUserDTO> getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
            appUserService.getById(id)
        );
    }

    @PostMapping
    public ResponseEntity<AppUserDTO> create(
            @Valid @RequestBody AppUserCreateDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    appUserService.create(dto)
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id) {

        appUserService.delete(id);

        return ResponseEntity.noContent().build();
    }
}