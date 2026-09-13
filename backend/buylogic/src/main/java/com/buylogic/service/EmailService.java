package com.buylogic.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.buylogic.model.Company;
import com.buylogic.repository.global.CompanyRepository;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    private final CompanyRepository companyRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public EmailService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    /**
     * Envoie un e-mail avec un PDF en pièce jointe via l'API HTTP de Brevo (Port
     * 443), en incluant dynamiquement le nom et le logo de l'entreprise.
     */
    public void sendEmailWithAttachment(
            String toEmail,
            String subject,
            String body,
            byte[] pdfBytes,
            String attachmentName,
            Integer companyId) {
        try {
            // Récupération de l'entreprise par son ID pour le nom et le logo
            String companyName = "BuyLogic";
            String logoUrl = null;

            if (companyId != null) {
                Company company = companyRepository.findById(companyId).orElse(null);
                if (company != null) {
                    if (company.getName() != null && !company.getName().isBlank()) {
                        companyName = company.getName();
                    }
                    logoUrl = company.getLogoUrl();
                }
            }

            // Construction du contenu HTML pour afficher le logo et le corps formaté
            StringBuilder htmlBuilder = new StringBuilder();
            htmlBuilder.append("<!DOCTYPE html><html><body style=\"font-family: Arial, sans-serif; color: #333; padding: 20px;\">");

            if (logoUrl != null && !logoUrl.isBlank()) {
                htmlBuilder.append("<div style=\"margin-bottom: 20px;\">")
                           .append("<img src=\"").append(logoUrl).append("\" alt=\"").append(companyName).append("\" style=\"max-height: 60px; width: auto;\" />")
                           .append("</div>");
            }

            if (body != null) {
                String formattedBody = body.replace("\n", "<br>");
                htmlBuilder.append("<p>").append(formattedBody).append("</p>");
            }

            htmlBuilder.append("<p style=\"color: #64748b; font-size: 12px; margin-top: 30px;\">E-mail envoyé par ").append(companyName).append("</p>");
            htmlBuilder.append("</body></html>");

            String htmlContent = htmlBuilder.toString();
            String url = "https://api.brevo.com/v3/smtp/email";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            // Encodage du PDF en Base64 exigé par l'API Brevo pour les pièces jointes
            String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

            Map<String, Object> emailPayload = Map.of(
                    "sender", Map.of("email", fromEmail, "name", companyName),
                    "to", List.of(Map.of("email", toEmail)),
                    "subject", subject,
                    "htmlContent", htmlContent,
                    "attachment", List.of(Map.of(
                            "content", base64Pdf,
                            "name", attachmentName)));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(emailPayload, headers);

            restTemplate.postForEntity(url, entity, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Échec de l'envoi de l'e-mail avec pièce jointe : " + subject, e);
        }
    }

    /**
     * Envoie l'e-mail de réinitialisation de mot de passe via l'API HTTP de Brevo.
     */
    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Réinitialisation de votre mot de passe BuyLogic";
        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        String htmlBody = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Réinitialisation de mot de passe</title>
                </head>
                <body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <h2>Réinitialisation de votre mot de passe</h2>
                    <p>Bonjour,</p>
                    <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte BuyLogic.</p>
                    <p style="margin: 30px 0;">
                        <a href="%s" style="background-color: #06b6d4; color: #09090b; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Réinitialiser mon mot de passe
                        </a>
                    </p>
                    <p>Ou copiez ce lien dans votre navigateur :</p>
                    <p><a href="%s">%s</a></p>
                    <p style="color: #64748b; font-size: 12px; margin-top: 30px;">Ce lien expire dans 15 minutes. Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail.</p>
                </body>
                </html>
                """
                .formatted(resetUrl, resetUrl, resetUrl);

        try {
            String url = "https://api.brevo.com/v3/smtp/email";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> emailPayload = Map.of(
                    "sender", Map.of("email", fromEmail, "name", "BuyLogic"),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "htmlContent", htmlBody);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(emailPayload, headers);

            restTemplate.postForEntity(url, entity, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Échec de l'envoi de l'e-mail de réinitialisation", e);
        }
    }

    /**
     * Envoie l'e-mail de vérification de compte via l'API HTTP de Brevo.
     */
    public void sendVerificationEmail(String to, String token) {
        String subject = "Activez votre compte BuyLogic";
        String verifyUrl = frontendUrl + "/verify-email?token=" + token;

        String htmlBody = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Activation de votre compte</title>
                </head>
                <body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <h2>Bienvenue sur BuyLogic !</h2>
                    <p>Bonjour,</p>
                    <p>Merci de vous être inscrit. Pour activer votre compte et commencer à utiliser BuyLogic, veuillez cliquer sur le bouton ci-dessous :</p>
                    <p style="margin: 30px 0;">
                        <a href="%s" style="background-color: #06b6d4; color: #09090b; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Activer mon compte
                        </a>
                    </p>
                    <p>Ou copiez ce lien dans votre navigateur :</p>
                    <p><a href="%s">%s</a></p>
                    <p style="color: #64748b; font-size: 12px; margin-top: 30px;">Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, vous pouvez ignorer cet e-mail.</p>
                </body>
                </html>
                """
                .formatted(verifyUrl, verifyUrl, verifyUrl);

        try {
            String url = "https://api.brevo.com/v3/smtp/email";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> emailPayload = Map.of(
                    "sender", Map.of("email", fromEmail, "name", "BuyLogic"),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "htmlContent", htmlBody);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(emailPayload, headers);
            restTemplate.postForEntity(url, entity, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Échec de l'envoi de l'e-mail de vérification", e);
        }
    }
}