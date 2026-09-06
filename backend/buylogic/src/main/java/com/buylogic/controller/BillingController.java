package com.buylogic.controller;

import com.buylogic.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/billing")
public class BillingController {

    private final StripeService stripeService;

    public BillingController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestParam Integer companyId) {
        String checkoutUrl = stripeService.createCheckoutSession(companyId);
        return ResponseEntity.ok(Collections.singletonMap("url", checkoutUrl));
    }
}