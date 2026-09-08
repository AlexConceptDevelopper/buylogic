package com.buylogic.controller;

import com.buylogic.model.Company;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;
import com.buylogic.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/billing")
public class BillingController {

    private final StripeService stripeService;
    private final CompanyRepository companyRepository;

    public BillingController(StripeService stripeService, CompanyRepository companyRepository) {
        this.stripeService = stripeService;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession() {
        Company company = getCurrentCompany();
        String checkoutUrl = stripeService.createCheckoutSession(company.getIdCompany());
        return ResponseEntity.ok(Collections.singletonMap("url", checkoutUrl));
    }

    @PostMapping("/cancel-subscription")
    public ResponseEntity<Map<String, String>> cancelSubscription() {
        Company company = getCurrentCompany();
        stripeService.cancelSubscriptionForCompany(company.getIdCompany());
        return ResponseEntity
                .ok(Collections.singletonMap("message", "Abonnement résilié avec succès à la fin de la période"));
    }

    private Company getCurrentCompany() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) {
            throw new IllegalStateException("Authenticated company not found.");
        }

        return companyRepository.findById(principal.companyId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated company not found."));
    }
}