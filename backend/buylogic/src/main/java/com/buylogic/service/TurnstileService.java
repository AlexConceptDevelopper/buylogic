package com.buylogic.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class TurnstileService {

    @Value("${cloudflare.turnstile.secret-key:0x4AAAAAAExyCL6tAd6S7FZuzcQCIA4iYUs}")
    private String secretKey;

    @Value("${cloudflare.turnstile.url:https://challenges.cloudflare.com/turnstile/v0/siteverify}")
    private String verifyUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public record TurnstileResponse(
            boolean success,
            @JsonProperty("error-codes") String[] errorCodes) {
    }

    public boolean verifyToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("secret", secretKey);
        requestBody.add("response", token);

        try {
            TurnstileResponse response = restTemplate.postForObject(
                    verifyUrl,
                    requestBody,
                    TurnstileResponse.class);
            return response != null && response.success();
        } catch (Exception e) {
            return false;
        }
    }
}