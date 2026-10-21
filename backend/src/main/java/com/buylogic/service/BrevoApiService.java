package com.buylogic.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class BrevoApiService {

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${app.mail.from}")
    private String mailFrom;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendTransactionalEmail(String toEmail, String subject, String htmlContent) {
        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> body = Map.of(
            "sender", Map.of("email", mailFrom, "name", "BuyLogic"),
            "to", List.of(Map.of("email", toEmail)),
            "subject", subject,
            "htmlContent", htmlContent
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            System.out.println(">>> E-mail Brevo API envoyé avec succès : " + response.getStatusCode());
        } catch (Exception e) {
            System.err.println(">>> Erreur lors de l'envoi de l'e-mail via l'API Brevo : " + e.getMessage());
            throw new RuntimeException("E-mail sending failed", e);
        }
    }
}