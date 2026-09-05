package com.buylogic.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

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
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Réinitialisation de votre mot de passe BuyLogic");

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

            helper.setText(htmlBody, true); // true active le mode HTML

            mailSender.send(message);
            System.out.println(">>> E-mail HTML de réinitialisation envoyé avec succès à : " + to);
        } catch (Exception e) {
            System.err.println(">>> ERREUR LORS DE L'ENVOI DE L'EMAIL : " + e.getMessage());
            e.printStackTrace();
        }
    }
}