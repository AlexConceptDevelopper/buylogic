package com.buylogic.service;

import com.buylogic.model.AuditLog;
import com.buylogic.model.Company;
import com.buylogic.model.Subscription;
import com.buylogic.repository.global.AuditLogRepository;
import com.buylogic.repository.global.SubscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionExpiryService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionExpiryService.class);

    private final SubscriptionRepository subscriptionRepository;
    private final AuditLogRepository auditLogRepository;

    public SubscriptionExpiryService(
            SubscriptionRepository subscriptionRepository,
            AuditLogRepository auditLogRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * S'exécute automatiquement tous les jours à 2h du matin.
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void checkAndExpireTrials() {
        log.info("Lancement de la vérification automatique des essais expirés...");

        LocalDateTime now = LocalDateTime.now();

        // Récupère les abonnements en TRIAL dont la date de fin est dépassée
        List<Subscription> expiredSubscriptions = subscriptionRepository.findByStatusAndTrialEndBefore("TRIAL", now);

        if (expiredSubscriptions.isEmpty()) {
            log.info("Aucun essai expiré trouvé.");
            return;
        }

        for (Subscription sub : expiredSubscriptions) {
            // 1. On passe l'abonnement en EXPIRED
            sub.setStatus("EXPIRED");

            // 2. On applique le soft delete sur la company si elle existe
            Company company = sub.getCompany();
            if (company != null) {
                company.setActive(false);
                log.info("Essai expiré : entreprise ID {} ({}) désactivée (soft delete) et abonnement passé à EXPIRED.", 
                        company.getIdCompany(), company.getName());

                // 📝 Log d'audit pour tracer l'expiration automatique et la désactivation
                AuditLog auditLog = new AuditLog();
                auditLog.setAction("SUBSCRIPTION_EXPIRED");
                auditLog.setActor("SystemCron");
                auditLog.setIpAddress("Internal");
                auditLog.setStatus(AuditLog.AuditStatus.WARNING);
                auditLog.setDetails(String.format("Fin d'essai atteinte pour l'entreprise ID %d (%s). Soft delete appliqué (Désactivée).", 
                        company.getIdCompany(), company.getName()));
                auditLogRepository.save(auditLog);
            }

            subscriptionRepository.save(sub);
        }

        log.info("{} abonnements et entreprises mis à jour (expirés).", expiredSubscriptions.size());
    }
}