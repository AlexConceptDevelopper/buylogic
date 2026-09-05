package com.buylogic.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    private final RestTemplate restTemplate = new RestTemplate();

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envoie un e-mail avec un PDF en pièce jointe en utilisant le sujet et le
     * corps préparés par le front-end.
     */
    public void sendEmailWithAttachment(
            String toEmail,
            String subject,
            String body,
            byte[] pdfBytes,
            String attachmentName) {
        // Si on est en prod sur Railway, l'API HTTP Mailtrap ne supporte pas facilement les pièces jointes binaires en JSON brut.
        // On force le passage par l'API ou on gère via l'infrastructure si nécessaire, 
        // mais pour le password reset c'est la cible principale. Ici on garde le comportement ou l'alternative HTTP si besoin.
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true active le mode multipart (nécessaire pour les pièces jointes)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body);

            // Attacher le PDF
            helper.addAttachment(attachmentName, new ByteArrayResource(pdfBytes));

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Échec de l'envoi de l'e-mail : " + subject, e);
        }
    }

    /**
     * Envoie l'e-mail de réinitialisation de mot de passe.
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

        // Si on est en prod (sur Railway), on passe par l'API HTTP Mailtrap (Port 443 HTTPS) pour contourner le blocage des ports SMTP
        if ("prod".equalsIgnoreCase(activeProfile)) {
            try {
                String url = "https://send.api.mailtrap.io/api/send";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", "Bearer " + mailPassword);

                Map<String, Object> body = new HashMap<>();
                body.put("from", Map.of("email", fromEmail, "name", "BuyLogic"));
                body.put("to", List.of(Map.of("email", to)));
                body.put("subject", subject);
                body.put("html", htmlBody);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
                
                System.out.println(">>> E-mail HTML envoyé via API Mailtrap (HTTPS) avec succès à : " + to + " - Status: " + response.getStatusCode());
            } catch (Exception e) {
                System.err.println(">>> ERREUR LORS DE L'ENVOI API MAILTRAP : " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            // En local, on garde ton code JavaMail d'origine intact
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlBody, true); // true active le mode HTML

                mailSender.send(message);
                System.out.println(">>> E-mail HTML de réinitialisation envoyé avec succès en local à : " + to);
            } catch (Exception e) {
                System.err.println(">>> ERREUR LORS DE L'ENVOI DE L'EMAIL : " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}