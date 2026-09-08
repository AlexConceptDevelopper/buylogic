package com.buylogic.service;

import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.model.AuditLog;
import com.buylogic.model.Company;
import com.buylogic.repository.global.AuditLogRepository;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.SubscriptionRepository;
import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${stripe.price.id}")
    private String stripePriceId;

    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AuditLogRepository auditLogRepository;

    public StripeService(
            CompanyRepository companyRepository,
            SubscriptionRepository subscriptionRepository,
            AuditLogRepository auditLogRepository) {
        this.companyRepository = companyRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    /**
     * Méthode utilitaire blindée : prend un Object pour éviter toute collision 
     * de nom de classe et extrait la date par réflexion.
     */
    private LocalDateTime extractPeriodEnd(Object stripeSubObj) {
        if (stripeSubObj == null) return null;
        try {
            Class<?> clazz = stripeSubObj.getClass();
            for (java.lang.reflect.Method method : clazz.getMethods()) {
                String name = method.getName();
                if ((name.equalsIgnoreCase("getCurrentPeriodEnd") || name.equalsIgnoreCase("getPeriodEnd")) 
                        && method.getParameterCount() == 0) {
                    Object result = method.invoke(stripeSubObj);
                    if (result instanceof Long val) {
                        return Instant.ofEpochSecond(val)
                                .atZone(ZoneId.systemDefault())
                                .toLocalDateTime();
                    } else if (result instanceof Integer val) {
                        return Instant.ofEpochSecond(val.longValue())
                                .atZone(ZoneId.systemDefault())
                                .toLocalDateTime();
                    }
                }
            }
        } catch (Exception e) {
            // Ignore
        }
        return null;
    }

    @Transactional
    public String createCheckoutSession(Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setSuccessUrl(frontendUrl + "/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true")
                    .setCancelUrl(frontendUrl + "/dashboard?canceled=true")
                    .setCustomerEmail(company.getEmail())
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPrice(stripePriceId)
                                    .build())
                    .putMetadata("companyId", company.getIdCompany().toString())
                    .build();

            Session session = Session.create(params);

            com.buylogic.model.Subscription subscription = company.getSubscription();
            if (subscription != null && session.getCustomer() != null) {
                subscription.setStripeCustomerId(session.getCustomer());
                subscriptionRepository.save(subscription);
            }

            return session.getUrl();

        } catch (StripeException e) {
            e.printStackTrace();
            throw new RuntimeException("Échec de la création de la session Stripe: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void handleCheckoutSessionCompleted(Event event) {
        com.stripe.model.checkout.Session session = (com.stripe.model.checkout.Session) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (session == null)
            return;

        String companyIdStr = session.getMetadata() != null ? session.getMetadata().get("companyId") : null;
        com.buylogic.model.Subscription subscription = null;
        Company company = null;

        if (companyIdStr != null) {
            Integer companyId = Integer.parseInt(companyIdStr);
            company = companyRepository.findById(companyId).orElse(null);
            if (company != null) {
                subscription = company.getSubscription();
            }
        } else if (session.getCustomerEmail() != null) {
            company = companyRepository.findByEmail(session.getCustomerEmail()).orElse(null);
            if (company != null) {
                subscription = company.getSubscription();
            }
        }

        if (subscription == null || company == null) {
            return;
        }

        subscription.setStripeCustomerId(session.getCustomer());
        subscription.setStripeSubscriptionId(session.getSubscription());
        subscription.setStripeStatus("active");
        subscription.setStatus("PAID");

        if (session.getSubscription() != null) {
            try {
                com.stripe.model.Subscription stripeSub = com.stripe.model.Subscription
                        .retrieve(session.getSubscription());
                LocalDateTime periodEnd = extractPeriodEnd(stripeSub);
                if (periodEnd != null) {
                    subscription.setCurrentPeriodEnd(periodEnd);
                }
            } catch (Exception e) {
                // Ignore
            }
        }
        
        if (!company.getActive()) {
            company.setActive(true);
            companyRepository.save(company);
        }

        subscriptionRepository.save(subscription);

        AuditLog auditLog = new AuditLog();
        auditLog.setAction("STRIPE_PAYMENT_SUCCESS");
        auditLog.setActor("StripeWebhook");
        auditLog.setIpAddress("Stripe");
        auditLog.setStatus(AuditLog.AuditStatus.SUCCESS);
        auditLog.setDetails(String.format("Paiement validé pour l'entreprise ID %d (%s). Abonnement passé à PAID.",
                company.getIdCompany(), company.getName()));
        auditLogRepository.save(auditLog);
    }

    @Transactional
    public void handleInvoicePaymentSucceeded(Event event) {
        com.stripe.model.Invoice invoice = (com.stripe.model.Invoice) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (invoice == null)
            return;

        if ("subscription_create".equals(invoice.getBillingReason())) {
            return;
        }

        String subscriptionId = null;
        if (invoice.getLines() != null && !invoice.getLines().getData().isEmpty()) {
            try {
                subscriptionId = invoice.getLines().getData().get(0).getParent().getSubscriptionItemDetails()
                        .getSubscription();
            } catch (Exception e) {
                // Ignore
            }
        }

        if (subscriptionId == null)
            return;

        com.buylogic.model.Subscription subscription = subscriptionRepository.findByStripeSubscriptionId(subscriptionId).orElse(null);

        if (subscription != null) {
            subscription.setStripeStatus("active");
            subscription.setStatus("PAID");

            try {
                com.stripe.model.Subscription stripeSub = com.stripe.model.Subscription.retrieve(subscriptionId);
                LocalDateTime periodEnd = extractPeriodEnd(stripeSub);
                if (periodEnd != null) {
                    subscription.setCurrentPeriodEnd(periodEnd);
                }
            } catch (Exception e) {
                // Ignore
            }

            subscriptionRepository.save(subscription);

            Company company = subscription.getCompany();
            if (company != null && !company.getActive()) {
                company.setActive(true);
                companyRepository.save(company);
            }

            AuditLog auditLog = new AuditLog();
            auditLog.setAction("STRIPE_RENEWAL_SUCCESS");
            auditLog.setActor("StripeWebhook");
            auditLog.setIpAddress("Stripe");
            auditLog.setStatus(AuditLog.AuditStatus.SUCCESS);
            auditLog.setDetails(String.format("Renouvellement automatique réussi pour l'abonnement %s (Entreprise ID %d).",
                    subscriptionId, company != null ? company.getIdCompany() : 0));
            auditLogRepository.save(auditLog);
        }
    }

    public void cancelSubscription(String stripeSubscriptionId) {
        try {
            com.stripe.model.Subscription stripeSub = com.stripe.model.Subscription.retrieve(stripeSubscriptionId);
            com.stripe.param.SubscriptionUpdateParams params = com.stripe.param.SubscriptionUpdateParams.builder()
                    .setCancelAtPeriodEnd(true)
                    .build();
            stripeSub.update(params);
        } catch (com.stripe.exception.StripeException e) {
            throw new RuntimeException("Échec de la programmation de la résiliation de l'abonnement Stripe : " + e.getMessage(), e);
        }
    }

    @Transactional
    public void cancelSubscriptionForCompany(Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        com.buylogic.model.Subscription localSub = company.getSubscription();
        if (localSub == null || localSub.getStripeSubscriptionId() == null) {
            throw new RuntimeException("Aucun abonnement Stripe actif trouvé pour cette entreprise.");
        }

        cancelSubscription(localSub.getStripeSubscriptionId());

        localSub.setStatus("CANCELED_PENDING");

        try {
            com.stripe.model.Subscription stripeSub = com.stripe.model.Subscription.retrieve(localSub.getStripeSubscriptionId());
            LocalDateTime periodEnd = extractPeriodEnd(stripeSub);
            if (periodEnd != null) {
                localSub.setCurrentPeriodEnd(periodEnd);
            }
        } catch (Exception e) {
            // Ignore
        }

        subscriptionRepository.save(localSub);

        AuditLog auditLog = new AuditLog();
        auditLog.setAction("SUBSCRIPTION_CANCEL_REQUESTED");
        auditLog.setActor("CompanyOwner_" + companyId);
        auditLog.setIpAddress("InternalAPI");
        auditLog.setStatus(AuditLog.AuditStatus.WARNING);
        auditLog.setDetails(String.format("L'entreprise ID %d a programmé la résiliation de son abonnement à la fin de la période.", companyId));
        auditLogRepository.save(auditLog);
    }

    public void resumeStripeSubscription(String stripeSubscriptionId) {
        try {
            com.stripe.model.Subscription stripeSub = com.stripe.model.Subscription.retrieve(stripeSubscriptionId);
            com.stripe.param.SubscriptionUpdateParams params = com.stripe.param.SubscriptionUpdateParams.builder()
                    .setCancelAtPeriodEnd(false)
                    .build();
            stripeSub.update(params);
        } catch (StripeException e) {
            throw new RuntimeException("Échec de la réactivation de l'abonnement Stripe : " + e.getMessage(), e);
        }
    }

    @Transactional
    public void resumeSubscriptionForCompany(Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        com.buylogic.model.Subscription localSub = company.getSubscription();
        if (localSub == null || localSub.getStripeSubscriptionId() == null) {
            throw new RuntimeException("Aucun abonnement trouvé pour cette entreprise.");
        }

        resumeStripeSubscription(localSub.getStripeSubscriptionId());

        localSub.setStatus("PAID");

        try {
            com.stripe.model.Subscription stripeSub = com.stripe.model.Subscription.retrieve(localSub.getStripeSubscriptionId());
            LocalDateTime periodEnd = extractPeriodEnd(stripeSub);
            if (periodEnd != null) {
                localSub.setCurrentPeriodEnd(periodEnd);
            }
        } catch (Exception e) {
            // Ignore
        }

        subscriptionRepository.save(localSub);

        AuditLog auditLog = new AuditLog();
        auditLog.setAction("SUBSCRIPTION_RESUMED");
        auditLog.setActor("CompanyOwner_" + companyId);
        auditLog.setIpAddress("InternalAPI");
        auditLog.setStatus(AuditLog.AuditStatus.SUCCESS);
        auditLog.setDetails(String.format("L'entreprise ID %d a réactivé son abonnement avec succès.", companyId));
        auditLogRepository.save(auditLog);
    }

    @Transactional
    public void handleSubscriptionUpdated(Event event) {
        com.stripe.model.Subscription stripeSub = (com.stripe.model.Subscription) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (stripeSub == null)
            return;

        String stripeSubscriptionId = stripeSub.getId();
        com.buylogic.model.Subscription subscription = subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId)
                .orElse(null);

        if (subscription != null) {
            subscription.setStripeStatus(stripeSub.getStatus());

            LocalDateTime periodEnd = extractPeriodEnd(stripeSub);
            if (periodEnd != null) {
                subscription.setCurrentPeriodEnd(periodEnd);
            }

            if (stripeSub.getCancelAtPeriodEnd() != null && stripeSub.getCancelAtPeriodEnd()) {
                subscription.setStatus("CANCELED_PENDING");
            } else if ("active".equals(stripeSub.getStatus())) {
                subscription.setStatus("PAID");
            }

            subscriptionRepository.save(subscription);
        }
    }

    @Transactional
    public void handleInvoicePaymentFailed(Event event) {
        com.stripe.model.Invoice invoice = (com.stripe.model.Invoice) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (invoice == null)
            return;

        String subscriptionId = null;
        if (invoice.getLines() != null && !invoice.getLines().getData().isEmpty()) {
            try {
                subscriptionId = invoice.getLines().getData().get(0).getParent().getSubscriptionItemDetails()
                        .getSubscription();
            } catch (Exception e) {
                // Ignore
            }
        }

        if (subscriptionId == null)
            return;

        com.buylogic.model.Subscription subscription = subscriptionRepository.findByStripeSubscriptionId(subscriptionId).orElse(null);

        if (subscription != null) {
            subscription.setStripeStatus("past_due");
            subscription.setStatus("PAST_DUE");
            subscriptionRepository.save(subscription);

            Company company = subscription.getCompany();
            if (company != null && company.getActive()) {
                company.setActive(false);
                companyRepository.save(company);
            }

            AuditLog auditLog = new AuditLog();
            auditLog.setAction("STRIPE_PAYMENT_FAILED");
            auditLog.setActor("StripeWebhook");
            auditLog.setIpAddress("Stripe");
            auditLog.setStatus(AuditLog.AuditStatus.CRITICAL);
            auditLog.setDetails(
                    String.format("Échec de paiement pour l'abonnement Stripe %s. Entreprise ID %d désactivée.",
                            subscriptionId, company != null ? company.getIdCompany() : 0));
            auditLogRepository.save(auditLog);
        }
    }

    @Transactional
    public void handleSubscriptionDeleted(Event event) {
        com.stripe.model.Subscription stripeSub = (com.stripe.model.Subscription) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (stripeSub == null)
            return;

        String subscriptionId = stripeSub.getId();
        com.buylogic.model.Subscription subscription = subscriptionRepository.findByStripeSubscriptionId(subscriptionId).orElse(null);

        if (subscription != null) {
            subscription.setStripeStatus("canceled");
            subscription.setStatus("CANCELED");

            LocalDateTime periodEnd = extractPeriodEnd(stripeSub);
            if (periodEnd != null) {
                subscription.setCurrentPeriodEnd(periodEnd);
            }

            subscriptionRepository.save(subscription);

            Company company = subscription.getCompany();
            if (company != null && company.getActive()) {
                company.setActive(false);
                companyRepository.save(company);
            }

            AuditLog auditLog = new AuditLog();
            auditLog.setAction("STRIPE_SUBSCRIPTION_DELETED");
            auditLog.setActor("StripeWebhook");
            auditLog.setIpAddress("Stripe");
            auditLog.setStatus(AuditLog.AuditStatus.WARNING);
            auditLog.setDetails(String.format("Abonnement résilié définitivement sur Stripe pour l'entreprise ID %d.",
                    company != null ? company.getIdCompany() : 0));
            auditLogRepository.save(auditLog);
        }
    }
}