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

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envoie un e-mail avec un PDF en pièce jointe en utilisant le sujet et le corps préparés par le front-end.
     */
    public void sendEmailWithAttachment(
            String toEmail, 
            String subject, 
            String body, 
            byte[] pdfBytes, 
            String attachmentName
    ) {
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
}