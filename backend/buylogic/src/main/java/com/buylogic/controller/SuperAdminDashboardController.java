package com.buylogic.controller;

import com.buylogic.dto.appuser.AppUserDTO;
import com.buylogic.dto.appuser.AppUserUpdateDTO;
import com.buylogic.dto.AuditLogResponseDto;
import com.buylogic.dto.company.CompanyConfigurationDTO;
import com.buylogic.dto.company.CompanyDTO;
import com.buylogic.dto.company.CompanyUpdateDTO;
import com.buylogic.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('SUPER_OWNER')")
public class SuperAdminDashboardController {

    private final AdminService adminService;

    public SuperAdminDashboardController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==========================================
    // SECTION : GESTION DES ENTREPRISES (COMPANIES)
    // ==========================================

    @GetMapping("/companies")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(adminService.findAllCompanies());
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.findCompanyById(id));
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<CompanyDTO> updateCompany(@PathVariable Integer id, @RequestBody CompanyUpdateDTO dto) {
        return ResponseEntity.ok(adminService.updateCompany(id, dto));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Integer id) {
        adminService.deleteCompany(id); // Fait un soft delete (active = false)
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // SECTION : GESTION DES UTILISATEURS (USERS)
    // ==========================================

    @GetMapping("/users")
    public ResponseEntity<List<AppUserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.findAllUsers());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AppUserDTO> updateUser(@PathVariable Integer id, @RequestBody AppUserUpdateDTO dto) {
        return ResponseEntity.ok(adminService.updateUser(id, dto));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        adminService.deleteUser(id); // Fait un soft delete (active = false)
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // SECTION : GESTION DES CONFIGURATIONS
    // ==========================================

    @GetMapping("/companies/{id}/configuration")
    public ResponseEntity<CompanyConfigurationDTO> getCompanyConfiguration(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.getCompanyConfigurationByCompanyId(id));
    }

    @PutMapping("/companies/{id}/configuration")
    public ResponseEntity<CompanyConfigurationDTO> updateCompanyConfiguration(
            @PathVariable Integer id, 
            @RequestBody CompanyConfigurationDTO dto) {
        return ResponseEntity.ok(adminService.updateCompanyConfiguration(id, dto));
    }

    // ==========================================
    // SECTION : GESTION DES JOURNAUX D'AUDIT
    // ==========================================

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLogResponseDto>> getAllAuditLogs() {
        return ResponseEntity.ok(adminService.findAllAuditLogs());
    }

    @DeleteMapping("/audit-logs/{id}")
    public ResponseEntity<Void> deleteAuditLog(@PathVariable Long id) {
        adminService.deleteAuditLog(id);
        return ResponseEntity.noContent().build();
    }

    //Health
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> checkSystemHealth() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "BuyLogic Core API");
        return ResponseEntity.ok(response);
    }
}