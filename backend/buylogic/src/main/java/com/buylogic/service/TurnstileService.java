package com.buylogic.service;

import com.buylogic.config.CloudflareProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class TurnstileService {

    private final CloudflareProperties cloudflareProperties;
    private final RestTemplate restTemplate = new RestTemplate();

    public TurnstileService(CloudflareProperties cloudflareProperties) {
        this.cloudflareProperties = cloudflareProperties;
    }

    public record TurnstileResponse(
            boolean success,
            @JsonProperty("error-codes") String[] errorCodes) {
    }

    public boolean verifyToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("secret", cloudflareProperties.getSecretKey());
        requestBody.add("response", token);

        try {
            TurnstileResponse response = restTemplate.postForObject(
                    cloudflareProperties.getUrl(),
                    requestBody,
                    TurnstileResponse.class);
            return response != null && response.success();
        } catch (Exception e) {
            return false;
        }
    }
}