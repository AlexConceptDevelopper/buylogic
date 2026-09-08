package com.buylogic.controller;

import com.buylogic.service.StripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/billing")
public class BillingWebhookController {

    private final StripeService stripeService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    public BillingWebhookController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        if (sigHeader == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing Stripe-Signature header");
        }

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error");
        }

        // Utilisation correcte de event.getType() à la place de l'inconnu eventType
        String eventType = event.getType();

        if ("checkout.session.completed".equals(eventType)) {
            stripeService.handleCheckoutSessionCompleted(event);
        } else if ("invoice.payment_failed".equals(eventType)) {
            stripeService.handleInvoicePaymentFailed(event);
        } else if ("customer.subscription.deleted".equals(eventType)) {
            stripeService.handleSubscriptionDeleted(event);
        }

        return ResponseEntity.ok("Success");
    }
}